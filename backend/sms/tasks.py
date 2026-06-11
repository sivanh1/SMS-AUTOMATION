from celery import shared_task
from django.conf import settings
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException


def format_phone_number(number):
    # Remove any characters that aren't numbers
    clean_num = ""
    for char in str(number):
        if char.isdigit():
            clean_num += char

    # If it's a standard 10-digit Indian number, add +91
    if len(clean_num) == 10:
        return "+91" + clean_num

    # If it's longer but doesn't have a plus sign, add it
    if not str(number).startswith('+'):
        return "+" + clean_num

    return str(number)


def get_failure_reason(error):
    # Figure out what went wrong based on Twilio's error code
    code = error.code

    # Trial account / unverified number errors
    if code == 21219:
        return "Unverified number — trial accounts can only send to verified numbers"
    if code == 21608:
        return "Unverified number — this number is not verified in your Twilio trial account"

    # Invalid or unreachable number
    if code == 21211:
        return "Invalid phone number format"
    if code == 21214:
        return "Phone number is not reachable (could be a landline)"
    if code == 21612:
        return "Number is not reachable via SMS — carrier or routing issue"
    if code == 21614:
        return "Not a valid mobile number — SMS not supported on this number"
    if code == 21215:
        return "Account not authorized to send to this country or region"

    # Wrong sender number
    if code == 21212:
        return "Invalid sender number — check your TWILIO_PHONE setting"
    if code == 21606:
        return "Sender number is not SMS-capable"
    if code == 21610:
        return "Message blocked — recipient has opted out by sending STOP"

    # Account or authentication errors
    if code == 20003:
        return "Authentication failed — invalid Twilio Account SID or Auth Token"
    if code == 20004:
        return "Twilio account is suspended or inactive"
    if code == 20429:
        return "Too many requests — Twilio rate limit hit"

    # Message content errors
    if code == 21602:
        return "Message body is empty or missing"
    if code == 21623:
        return "Message is too long — exceeds maximum allowed length"

    # Carrier and delivery errors
    if code == 30001:
        return "Message delivery failed — queue overflow"
    if code == 30002:
        return "Account suspended by carrier"
    if code == 30003:
        return "Unreachable destination — handset may be offline or number inactive"
    if code == 30004:
        return "Message blocked by carrier"
    if code == 30005:
        return "Unknown destination — number does not exist"
    if code == 30006:
        return "Landline or unreachable carrier — SMS cannot be delivered"
    if code == 30007:
        return "Message was filtered as spam by carrier"
    if code == 30008:
        return "Delivery failed — unknown error from carrier"
    if code == 30009:
        return "Missing segment — partial message delivery failure"
    if code == 30010:
        return "Message price exceeds the max price limit"

    # If we don't recognize the code, just return the raw error
    return f"Twilio error (code {code}): {error.msg}"


@shared_task(bind=True, max_retries=3)
def send_single_sms(self, log_id):
    # Import here to stop circular import errors
    from sms.models import SMSLog

    # Try to find the SMS log in the database
    try:
        sms = SMSLog.objects.get(id=log_id)
    except SMSLog.DoesNotExist:
        print(f"[SMS TASK] ERROR: SMSLog id={log_id} not found.")
        return

    try:
        # Try sending the message via Twilio
        client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN
        )
        client.messages.create(
            body=sms.message,
            from_=settings.TWILIO_PHONE,
            to=format_phone_number(sms.mobile_number)
        )

        # If it works, mark it as logged and clear any old failure reason
        sms.status = 'logged'
        sms.failure_reason = None
        sms.save()
        print(f"[SMS TASK] SUCCESS: Sent to {sms.mobile_number} (log_id={log_id})")

    except TwilioRestException as e:
        # Twilio told us exactly what went wrong
        reason = get_failure_reason(e)
        print(f"[SMS TASK] TWILIO ERROR (code {e.code}): {reason} — {sms.mobile_number}")

        # Some errors are temporary so it's worth retrying
        temporary_errors = {20429, 30001, 30009}

        if e.code in temporary_errors:
            try:
                # Wait 15 seconds and try again
                self.retry(countdown=15)
                return
            except self.MaxRetriesExceededError:
                # Ran out of retries, give up
                reason = f"{reason} — failed after 3 retries"

        # Save the failure with the reason
        sms.status = 'failed'
        sms.failure_reason = reason
        sms.save()

    except Exception as e:
        # Something else went wrong (network issue, server error, etc.)
        reason = f"Unexpected error: {str(e)}"
        print(f"[SMS TASK] UNEXPECTED ERROR: {reason} — log_id={log_id}")

        try:
            # Try again in 15 seconds
            self.retry(countdown=15)
            return
        except self.MaxRetriesExceededError:
            # Ran out of retries, save the failure
            sms.status = 'failed'
            sms.failure_reason = f"{reason} — failed after 3 retries"
            sms.save()


@shared_task
def send_bulk_sms(log_id_list):
    # Loop through the list of IDs and trigger the single SMS task for each one
    for log_id in log_id_list:
        send_single_sms.delay(log_id)
    print(f"[BULK SMS TASK] Queued {len(log_id_list)} messages.")
from celery import shared_task
from django.conf import settings
from twilio.rest import Client

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

def send_twilio_message(phone_number, text_message):
    # Connect to Twilio and send the SMS
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    client.messages.create(
        body=text_message,
        from_=settings.TWILIO_PHONE,
        to=format_phone_number(phone_number)
    )

@shared_task(bind=True, max_retries=3)
def send_single_sms(self, log_id):
    # Import here to stop circular import errors
    from sms.models import SMSLog  
    
    # Try to find the SMS log in the database
    try:
        sms = SMSLog.objects.get(id=log_id)
    except SMSLog.DoesNotExist:
        print(f"Error: SMS log with ID {log_id} does not exist.")
        return
        
    try:
        # Try sending the message
        send_twilio_message(sms.mobile_number, sms.message)
        
        # If it works, save the status as logged
        sms.status = 'logged'
        sms.save()
        print(f"Successfully sent message to {sms.mobile_number}")
        
    except Exception as e:
        print(f"Twilio error: {e}")
        
        # If it fails, try again in 15 seconds
        try:
            self.retry(countdown=15)
        except self.MaxRetriesExceededError:
            # If we run out of retries, permanently mark it as failed
            sms.status = 'failed'
            sms.save()
            print(f"Message to {sms.mobile_number} failed completely.")

@shared_task
def send_bulk_sms(log_id_list):
    # Loop through the list of IDs and trigger the single SMS task for each one
    for log_id in log_id_list:
        send_single_sms.delay(log_id)
        
    print(f"Pushed {len(log_id_list)} messages to the queue.")
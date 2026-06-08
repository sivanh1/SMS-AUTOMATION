from datetime import datetime

from django.utils.dateparse import parse_datetime

from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from services.template_engine import (
    generate_sms_preview
)
from rest_framework.permissions import (
    IsAuthenticated,
)

from rest_framework.response import Response

from customers.models import Customer

from .models import SMSLog

from .serializers import SMSLogSerializer


# SEND SMS

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_sms(request):

    p_id = request.data.get("p_id")

    message = request.data.get("message")

    scheduled_time_str = request.data.get("scheduled_time")

    scheduled_datetime = None

    current_status = 'logged'

    if scheduled_time_str:

        scheduled_datetime = parse_datetime(scheduled_time_str)

        current_status = 'pending'

    # VALIDATE INPUTS
    if not p_id or not message:

        return Response({

            "error":
            "p_id and message are required"

        }, status=400)

    try:

        # GET CUSTOMER
        customer = Customer.objects.get(
            p_id=p_id
        )

        mobile_number = str(
            customer.mobile_number
        ).strip()

        # VALIDATE MOBILE NUMBER
        if not mobile_number:

            return Response({

                "error":
                "Customer mobile number is missing"

            }, status=400)

        # REMOVE .0 IF EXISTS
        mobile_number = mobile_number.replace(
            ".0",
            ""
        )

        # CHECK NUMBER LENGTH
        if (
            not mobile_number.isdigit()
            or
            len(mobile_number) != 10
        ):

            return Response({

                "error":
                "Invalid mobile number"

            }, status=400)

        # CREATE SMS LOG
        sms_log = SMSLog.objects.create(

    p_id=customer.p_id,

    cust_name=customer.cust_name,

    mobile_number=mobile_number,

    extra_fields=
    customer.extra_fields,

    sent_by=request.user
    if request.user.is_authenticated
    else None,

    message=message,

    status=current_status,

    scheduled_time=scheduled_datetime
)

        # CONSOLE LOG
        print(

            f'[{datetime.now()}] INFO: '

            f'[SMS] '

            f'{{'

            f'"to":"{mobile_number}", '

            f'"p_id":"{customer.p_id}", '

            f'"message":"{message}", '

            f'"status":"{current_status}"'

            f'}}'
        )

        return Response({

            "message":
            "SMS scheduled successfully" if current_status == 'pending' else "SMS logged successfully",

            "status":
            sms_log.status

        })

    except Customer.DoesNotExist:

        return Response({

            "error":
            "Customer not found"

        }, status=404)

    except Exception as error:

        print("SMS ERROR:", error)

        return Response({

            "error":
            str(error)

        }, status=500)
    
# SMS LOGS

@api_view(['GET'])
@permission_classes([IsAuthenticated])

def sms_logs(request):

    logs = SMSLog.objects.all().order_by(
        '-created_at'
    )

    serializer = SMSLogSerializer(
        logs,
        many=True
    )

    return Response(serializer.data)

# BULK SMS PREVIEW

# BULK SMS PREVIEW

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def preview_bulk_sms(request):

    template = request.data.get(
        "template"
    )

    if not template:

        return Response({

            "error":
            "template is required"

        }, status=400)

    try:

        customers = Customer.objects.all()

        previews = []

        for customer in customers:

            customer_data = {

                "p_id":
                customer.p_id,

                "cust_name":
                customer.cust_name,

                "mobile_number":
                customer.mobile_number,

                **customer.extra_fields
            }

            message = generate_sms_preview(

                template,

                customer_data
            )

            previews.append({

                "p_id":
                customer.p_id,

                "cust_name":
                customer.cust_name,

                "mobile_number":
                customer.mobile_number,

                "extra_fields":
                customer.extra_fields,

                "message":
                message
            })

        return Response({

            "count":
            len(previews),

            "customers":
            previews
        })

    except Exception as error:

        print(
            "BULK PREVIEW ERROR:",
            error
        )

        return Response({

            "error":
            str(error)

        }, status=500)
    
# SEND BULK SMS

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_bulk_sms(request):

    customers = request.data.get(
        "customers",
        []
    )

    scheduled_time_str = request.data.get("scheduled_time")

    scheduled_datetime = None

    target_status = 'logged'

    if scheduled_time_str:

        scheduled_datetime = parse_datetime(scheduled_time_str)

        target_status = 'pending'

    if not customers:

        return Response({

            "error":
            "customers list is required"

        }, status=400)

    sent_count = 0

    failed = []

    for item in customers:

        try:

            customer = Customer.objects.get(
                p_id=item["p_id"]
            )

            mobile_number = str(
                customer.mobile_number
            ).strip()

            # REMOVE .0
            mobile_number = mobile_number.replace(
                ".0",
                ""
            )

            # INVALID NUMBER
            if (
                not mobile_number
                or
                not mobile_number.isdigit()
                or
                len(mobile_number) != 10
            ):

                SMSLog.objects.create(

    p_id=customer.p_id,

    cust_name=customer.cust_name,

    mobile_number=mobile_number,

    extra_fields=dict(
        customer.extra_fields
    ),

    sent_by=request.user
    if request.user.is_authenticated
    else None,

    message=item["message"],

    status='failed',

    scheduled_time=scheduled_datetime
)

                failed.append({

                    "p_id":
                    customer.p_id,

                    "error":
                    "Invalid mobile number"
                })

                print(

                    f'[{datetime.now()}] ERROR: '

                    f'[BULK_SMS] '

                    f'{{'

                    f'"to":"{mobile_number}", '

                    f'"p_id":"{customer.p_id}", '

                    f'"message":"{item["message"]}", '

                    f'"status":"failed"'

                    f'}}'
                )

                continue

            # SUCCESS LOG
            sms_log = SMSLog.objects.create(

    p_id=customer.p_id,

    cust_name=customer.cust_name,

    mobile_number=mobile_number,

    extra_fields=dict(
        customer.extra_fields
    ),

    sent_by=request.user
    if request.user.is_authenticated
    else None,

    message=item["message"],

    status=target_status,

    scheduled_time=scheduled_datetime
)

            print(

                f'[{datetime.now()}] INFO: '

                f'[BULK_SMS] '

                f'{{'

                f'"to":"{mobile_number}", '

                f'"p_id":"{customer.p_id}", '

                f'"message":"{item["message"]}", '

                f'"status":"{target_status}"'

                f'}}'
            )

            sent_count += 1

        except Exception as error:

            failed.append({

                "p_id":
                item.get("p_id"),

                "error":
                str(error)
            })

    return Response({

        "message":
        "Bulk SMS scheduled" if target_status == 'pending' else "Bulk SMS completed",

        "sent_count":
        sent_count,

        "failed_count":
        len(failed),

        "failed":
        failed
    })
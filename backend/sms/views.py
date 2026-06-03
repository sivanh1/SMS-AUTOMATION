from datetime import datetime

from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from services.template_engine import (
    generate_sms_preview
)
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny,
)

from rest_framework.response import Response

from customers.models import Customer

from .models import SMSLog

from .serializers import SMSLogSerializer


# SEND SMS

@api_view(['POST'])
@permission_classes([AllowAny])
def send_sms(request):

    p_id = request.data.get("p_id")

    message = request.data.get("message")

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

            amount=customer.amount,

            due_date=customer.due_date,

            sent_by=request.user
            if request.user.is_authenticated
            else None,

            message=message,

            status='logged'
        )

        # CONSOLE LOG
        print(

            f'[{datetime.now()}] INFO: '

            f'[SMS] '

            f'{{'

            f'"to":"{mobile_number}", '

            f'"p_id":"{customer.p_id}", '

            f'"message":"{message}", '

            f'"status":"logged"'

            f'}}'
        )

        return Response({

            "message":
            "SMS logged successfully",

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
@permission_classes([AllowAny])

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

@api_view(['POST'])
@permission_classes([AllowAny])

def preview_bulk_sms(request):

    template = request.data.get("template")

    if not template:

        return Response({

            "error":
            "template is required"

        }, status=400)

    try:

        customers = Customer.objects.filter(
            amount__gt=0
        )

        previews = []

        for customer in customers:

            message = generate_sms_preview(

                template,

                {
                    "cust_name":
                    customer.cust_name,

                    "amount":
                    customer.amount,

                    "due_date":
                    customer.due_date,

                    "mobile_number":
                    customer.mobile_number,

                    "p_id":
                    customer.p_id
                }
            )

            previews.append({

                "p_id":
                customer.p_id,

                "cust_name":
                customer.cust_name,

                "mobile_number":
                customer.mobile_number,

                "amount":
                customer.amount,

                "due_date":
                customer.due_date,

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

        return Response({

            "error":
            str(error)

        }, status=500)
    
# SEND BULK SMS

@api_view(['POST'])
@permission_classes([AllowAny])
def send_bulk_sms(request):

    customers = request.data.get(
        "customers",
        []
    )

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

                    amount=customer.amount,

                    due_date=customer.due_date,

                    sent_by=request.user
                    if request.user.is_authenticated
                    else None,

                    message=item["message"],

                    status='failed'
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

                amount=customer.amount,

                due_date=customer.due_date,

                sent_by=request.user
                if request.user.is_authenticated
                else None,

                message=item["message"],

                status='logged'
            )

            print(

                f'[{datetime.now()}] INFO: '

                f'[BULK_SMS] '

                f'{{'

                f'"to":"{mobile_number}", '

                f'"p_id":"{customer.p_id}", '

                f'"message":"{item["message"]}", '

                f'"status":"logged"'

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
        "Bulk SMS completed",

        "sent_count":
        sent_count,

        "failed_count":
        len(failed),

        "failed":
        failed
    })
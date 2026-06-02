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

    if not p_id or not message:

        return Response({

            "error":
            "p_id and message are required"

        }, status=400)

    try:

        customer = Customer.objects.get(
            p_id=p_id
        )

        sms_log = SMSLog.objects.create(

            customer=customer,

            sent_by=request.user
            if request.user.is_authenticated
            else None,

            message=message,

            status='logged'
        )

        print(

            f'[{datetime.now()}] INFO: '

            f'[SMS] '

            f'{{'

            f'"to":"{customer.mobile_number}", '

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

            sms_log = SMSLog.objects.create(

                customer=customer,

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

                f'"to":"{customer.mobile_number}", '

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
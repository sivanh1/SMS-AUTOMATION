from datetime import datetime

from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes

from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response

from customers.models import Customer

from .models import SMSLog

from .serializers import SMSLogSerializer


@api_view(['POST'])

@permission_classes([IsAuthenticated])

def send_sms(request):

    p_id = request.data.get("p_id")

    message = request.data.get("message")

    if not p_id or not message:

        return Response({

            "error": "p_id and message are required"

        }, status=400)

    try:

        customer = Customer.objects.get(
            p_id=p_id
        )

        sms_log = SMSLog.objects.create(

            customer=customer,

            sent_by=request.user,

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

            "message": "SMS logged successfully",

            "status": sms_log.status
        })

    except Customer.DoesNotExist:

        return Response({

            "error": "Customer not found"

        }, status=404)

    except Exception as error:

        return Response({

            "error": str(error)

        }, status=500)
    
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
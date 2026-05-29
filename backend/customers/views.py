from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Customer
from services.google_sheets_service import get_sheet_data
from django.db.models import Q

from .serializer import CustomerSerializer
from services.template_engine import generate_sms_preview


#GET CUSTOMERS
@api_view(['GET'])
def list_customers(request):

    customers = Customer.objects.all().order_by(
        'id'
    )

    serializer = CustomerSerializer(
        customers,
        many=True
    )

    return Response(serializer.data)


#SYNC CUSTOMERS
@api_view(['POST'])
def sync_customers(request):
    sheet_id = request.data.get("sheet_id")

    if not sheet_id:
        return Response({
            "error": "Sheet ID is required"
        }, status=400)

    try:
        records = get_sheet_data(sheet_id)

        synced_count = 0

        for row in records:
            Customer.objects.update_or_create(
                p_id=row.get("p_id"),
                defaults={
                    "cust_name": row.get("cust_name"),
                    "mobile_number": row.get("mobile_number"),
                    "amount": row.get("amount"),
                    "due_date": row.get("due_date"),
                    "sheet_id": sheet_id
                }
            )

            synced_count += 1

        return Response({
            "message": "Customers synchronized successfully",
            "total_synced": synced_count
        })

    except Exception as error:
        return Response({
            "error": str(error)
        }, status=500)
    

#SEARCH CUSTOMERS
@api_view(['GET'])
def search_customers(request):

    search = request.GET.get('search')

    customers = Customer.objects.filter(

        Q(cust_name__icontains=search) |
        Q(p_id__icontains=search)

    )

    serializer = CustomerSerializer(customers, many=True)

    return Response(serializer.data)


#GET CUSTOMER BY P_ID
@api_view(['POST'])
def get_customer(request):
    customer_id = request.data.get("p_id")

    if customer_id is None:
        return Response(
            {
                "error": "Please provide p_id"
            },
            status=400
        )

    try:
        customer = Customer.objects.get(
            p_id=customer_id
        )

        customer_data = CustomerSerializer(customer)

        return Response(customer_data.data)

    except Customer.DoesNotExist:
        return Response(
            {
                "error": "Customer not found"
            },
            status=404
        )
    
#PREVIEW SMS
@api_view(['POST'])
def preview_sms(request):
    customer_id = request.data.get("p_id")
    template = request.data.get("template")

    if not customer_id or not template:
        return Response(
            {
                "error": "p_id and template are required"
            },
            status=400
        )

    try:
        customer = Customer.objects.get(
            p_id=customer_id
        )

        customer_data = {
            "cust_name": customer.cust_name,
            "amount": customer.amount,
            "due_date": customer.due_date,
            "mobile_number": customer.mobile_number,
            "p_id": customer.p_id,
        }

        preview_message = generate_sms_preview(
            template,
            customer_data
        )

        return Response(
            {
                "preview": preview_message
            }
        )

    except Customer.DoesNotExist:
        return Response(
            {
                "error": "Customer not found"
            },
            status=404
        )

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Customer
from services.google_sheets_service import get_sheet_data
from django.db.models import Q
from openpyxl import load_workbook

from rest_framework.parsers import MultiPartParser

from .serializer import XLSXUploadSerializer

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

        # CLEAR OLD CUSTOMERS
        Customer.objects.all().delete()

        records = get_sheet_data(sheet_id)

        synced_count = 0

        for row in records:

            if not row.get("p_id"):
                continue

            Customer.objects.create(

                p_id=row.get("p_id"),

                cust_name=row.get("cust_name"),

                mobile_number=row.get("mobile_number"),

                amount=row.get("amount") or 0,

                due_date=row.get("due_date") or None,

                sheet_id=sheet_id
            )

            synced_count += 1

        return Response({

            "message":
            "Customers synchronized successfully",

            "total_synced":
            synced_count

        })

    except Exception as error:

        print("SYNC ERROR:", error)

        return Response({

            "error": "Check Sheet ID"

        }, status=404)
    
    
# IMPORT CUSTOMERS FROM XLSX
# IMPORT CUSTOMERS FROM XLSX
@api_view(['POST'])
def import_customers_xlsx(request):

    serializer = XLSXUploadSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=400
        )

    file = serializer.validated_data['file']

    try:

        workbook = load_workbook(file)

        sheet = workbook.active

        customers = []

        # SKIP HEADER ROW
        for row in sheet.iter_rows(
            min_row=2,
            values_only=True
        ):

            p_id, cust_name, mobile_number, amount, due_date = row

            # SKIP EMPTY ROWS
            if not p_id:
                continue


            # FORMAT P_ID
            if p_id is not None:

                if isinstance(
                    p_id,
                    float
                ):

                    p_id = int(p_id)

                p_id = str(p_id)


            # FORMAT MOBILE NUMBER
            if mobile_number is not None:

                if isinstance(
                    mobile_number,
                    float
                ):

                    mobile_number = int(
                        mobile_number
                    )

                mobile_number = str(
                    mobile_number
                )


            # FORMAT DUE DATE
            if due_date is not None:

                due_date = due_date.strftime(
                    "%Y-%m-%d"
                )


            customers.append(

                Customer(

                    p_id=p_id,

                    cust_name=cust_name,

                    mobile_number=mobile_number,

                    amount=amount or 0,

                    due_date=due_date or None,
                )
            )

        # DELETE OLD CUSTOMERS
        Customer.objects.all().delete()

        # BULK INSERT
        Customer.objects.bulk_create(customers)

        return Response({

            "message":
            "Customers imported successfully",

            "total_imported":
            len(customers)

        })

    except Exception as error:

        print(
            "XLSX IMPORT ERROR:",
            error
        )

        return Response({

            "error":
            "Failed to import XLSX file"

        }, status=500)
    
#SEARCH CUSTOMERS
@api_view(['GET'])
def search_customers(request):

    search = request.GET.get('search')

    customers = Customer.objects.filter(

        Q(cust_name__icontains=search) |
        Q(p_id=search)

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

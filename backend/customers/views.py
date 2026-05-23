from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Customer
from services.google_sheets_service import get_sheet_data


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
from rest_framework.decorators import (
    api_view,
    permission_classes
)

from rest_framework.permissions import (
    IsAuthenticated
)

from rest_framework.response import Response

from .models import Query

from .serilaizers import QuerySerializer


# CREATE QUERY
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_query(request):

    title = request.data.get(
        "title"
    )

    description = request.data.get(
        "description"
    )

    priority = request.data.get(
        "priority",
        "medium"
    )

    if not title or not description:

        return Response({

            "error":
            "title and description are required"

        }, status=400)

    query = Query.objects.create(

        title=title,

        description=description,

        priority=priority,

        created_by=request.user
    )

    return Response({

        "message":
        "Query created successfully",

        "query_id":
        query.id
    })


# MY QUERIES (OPERATOR)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_queries(request):

    queries = Query.objects.filter(

        created_by=request.user

    ).order_by(

        '-created_at'
    )

    serializer = QuerySerializer(

        queries,

        many=True
    )

    return Response(
        serializer.data
    )


# ALL QUERIES (ADMIN)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_queries(request):

    queries = Query.objects.all().order_by(

        '-created_at'
    )

    serializer = QuerySerializer(

        queries,

        many=True
    )

    return Response(
        serializer.data
    )


# REPLY QUERY (ADMIN)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def reply_query(request, query_id):

    try:

        query = Query.objects.get(
            id=query_id
        )

        admin_response = request.data.get(
            "admin_response"
        )

        status = request.data.get(
            "status"
        )

        if admin_response:

            query.admin_response = (
                admin_response
            )

        if status:

            query.status = status

        query.save()

        return Response({

            "message":
            "Query updated successfully"
        })

    except Query.DoesNotExist:

        return Response({

            "error":
            "Query not found"

        }, status=404)
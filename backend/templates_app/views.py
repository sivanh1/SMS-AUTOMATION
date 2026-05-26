from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.permissions import IsAdminUserRole

from .models import SMSTemplate
from .serializers import SMSTemplateSerializer

# GET ALL SMS TEMPLATES

@api_view(['GET'])
@permission_classes([IsAuthenticated])

def get_templates(request):

    
    templates = SMSTemplate.objects.all().order_by('-created_at')

    
    serializer = SMSTemplateSerializer(templates, many=True)

    
    return Response(serializer.data)



# CREATE NEW TEMPLATE

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUserRole])

def create_template(request):

    
    serializer = SMSTemplateSerializer(data=request.data)

    
    if serializer.is_valid():

        
        serializer.save(created_by=request.user)

        return Response(serializer.data, status=201)

    
    return Response(serializer.errors, status=400)


# UPDATE TEMPLATE

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUserRole])

def update_template(request, id):

    try:
        
        template = SMSTemplate.objects.get(id=id)

    except SMSTemplate.DoesNotExist:

        return Response({
            "error": "Template not found"
        }, status=404)

   
    serializer = SMSTemplateSerializer(
        template,
        data=request.data,
        partial=True
    )

    
    if serializer.is_valid():

        serializer.save()

        return Response(serializer.data)

    
    return Response(serializer.errors, status=400)



# DELETE TEMPLATE

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUserRole])

def delete_template(request, id):

    try:
        # Find template by ID
        template = SMSTemplate.objects.get(id=id)

        # Delete template
        template.delete()

        return Response({
            "message": "Template deleted successfully"
        })

    except SMSTemplate.DoesNotExist:

        return Response({
            "error": "Template not found"
        }, status=404)
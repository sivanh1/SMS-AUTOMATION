from django.contrib.auth import authenticate

from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes

from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken

from .serializer import LoginSerializer
from .models import UserProfile


@api_view(['POST'])
@permission_classes([AllowAny])

def login_user(request):

    login_data = LoginSerializer(
        data=request.data
    )

    if login_data.is_valid():

        username = login_data.validated_data['username']

        password = login_data.validated_data['password']

        user = authenticate(
            username=username,
            password=password
        )

        if user:

            refresh_token = RefreshToken.for_user(user)

            profile = UserProfile.objects.get(
                user=user
            )

            return Response({

                "message": "Login successful",

                "access_token": str(
                    refresh_token.access_token
                ),

                "refresh_token": str(
                    refresh_token
                ),

                "username": user.username,

                "role": profile.role
            })

        return Response(
            {
                "error": "Invalid username or password"
            },
            status=401
        )

    return Response(
        login_data.errors,
        status=400
    )
from django.contrib.auth import authenticate

from django.contrib.auth.models import User

from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes

from rest_framework.permissions import ( AllowAny, IsAuthenticated)

from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken

from .serializer import LoginSerializer

from .models import UserProfile


#USER LOGIN 

@api_view(['POST'])
@permission_classes([AllowAny])

def login_user(request):

    login_data = LoginSerializer(
        data=request.data
    )

    if login_data.is_valid():

        username = login_data.validated_data[
            'username'
        ]

        password = login_data.validated_data[
            'password'
        ]

        user = authenticate(

            username=username,

            password=password
        )

        if user:

            refresh_token = RefreshToken.for_user(
                user
            )

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

#GET USERS

@api_view(['GET'])
@permission_classes([IsAuthenticated])

def get_users(request):

    users = User.objects.all().order_by(
        '-date_joined'
    )

    user_data = []

    for user in users:

        profile = UserProfile.objects.filter(
            user=user
        ).first()

        user_data.append({

            "id": user.id,

            "username": user.username,

            "role": profile.role if profile else "admin",

            "is_superuser": user.is_superuser,

            "date_joined": user.date_joined

        })

    return Response(user_data)

#CREATE USER

@api_view(['POST'])
@permission_classes([IsAuthenticated])

def create_user(request):

    username = request.data.get(
        "username"
    )

    password = request.data.get(
        "password"
    )

    role = request.data.get(
        "role"
    )

    if not username or not password:

        return Response({

            "error": "Username and password required"

        }, status=400)

    if User.objects.filter(
        username=username
    ).exists():

        return Response({

            "error": "Username already exists"

        }, status=400)

    user = User.objects.create_user(

        username=username,

        password=password
    )

    profile = UserProfile.objects.get(
        user=user
    )

    profile.role = role

    profile.save()

    return Response({

        "message": "User created successfully"

    })
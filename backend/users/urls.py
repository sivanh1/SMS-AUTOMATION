from django.urls import path

from .views import (

    login_user,

    get_users,

    create_user
)

urlpatterns = [

    path(
        'login/',
        login_user
    ),

    path(
        'all/',
        get_users
    ),

    path(
        'create/',
        create_user
    ),
]
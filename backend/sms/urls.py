from django.urls import path

from .views import (
    send_sms,
    sms_logs
)

urlpatterns = [

    path('send/', send_sms),

    path('logs/', sms_logs),
]
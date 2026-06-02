from django.urls import path

from .views import (
    send_sms,
    sms_logs,
    preview_bulk_sms,
    send_bulk_sms
)

urlpatterns = [

    path('send/', send_sms),

    path('logs/', sms_logs),

    path("bulk/preview/",preview_bulk_sms),
    
    path("bulk/send/",send_bulk_sms),
]
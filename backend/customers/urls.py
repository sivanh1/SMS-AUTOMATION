from django.urls import path

from .views import sync_customers
from .views import search_customers
from .views import get_customer
from .views import preview_sms
urlpatterns = [
    path('sync/', sync_customers),
    path('search/', search_customers),

    path('customer/', get_customer),

    path('preview/', preview_sms),
]
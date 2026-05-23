from django.urls import path

from .views import sync_customers


urlpatterns = [
    path('sync/', sync_customers),
]
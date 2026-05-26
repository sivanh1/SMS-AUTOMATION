
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/customers/', include('customers.urls')),
    path('api/users/', include('users.urls')),
    path('api/templates/',include('templates_app.urls')),
    path('api/sms/',include('sms.urls')),
    
]

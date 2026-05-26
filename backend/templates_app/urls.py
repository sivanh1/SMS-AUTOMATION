from django.urls import path

from .views import (
    get_templates,
    create_template,
    update_template,
    delete_template
)

urlpatterns = [

    path('', get_templates),

    path('create/', create_template),

    path('update/<int:id>/', update_template),

    path('delete/<int:id>/', delete_template),
]
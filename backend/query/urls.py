from django.urls import path

from .views import (
    create_query,
    my_queries,
    all_queries,
    reply_query,
)


urlpatterns = [

    # OPERATOR
    path(
        'create/',
        create_query
    ),

    path(
        'my/',
        my_queries
    ),

    # ADMIN
    path(
        'all/',
        all_queries
    ),

    path(
        'reply/<int:query_id>/',
        reply_query
    ),
]
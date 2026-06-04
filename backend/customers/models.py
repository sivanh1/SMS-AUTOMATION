from django.db import models


class Customer(models.Model):

    p_id = models.CharField(
        max_length=100,
        unique=True
    )

    cust_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    mobile_number = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    extra_fields = models.JSONField(
        default=dict
    )

    sheet_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return (
            self.cust_name
            or self.p_id
        )
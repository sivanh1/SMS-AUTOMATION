from django.db import models

from django.contrib.auth.models import User


class SMSLog(models.Model):

    STATUS_CHOICES = (

        ('logged', 'Logged'),

        ('failed', 'Failed'),
    )

    # SNAPSHOT CUSTOMER DATA

    p_id = models.CharField(
        max_length=100
    )

    cust_name = models.CharField(
        max_length=255
    )

    mobile_number = models.CharField(
        max_length=20
    )

    extra_fields = models.JSONField(
        default=dict
    )

    # SMS DATA

    message = models.TextField()

    status = models.CharField(

        max_length=20,

        choices=STATUS_CHOICES,

        default='logged'
    )

    # USER

    sent_by = models.ForeignKey(

        User,

        on_delete=models.SET_NULL,

        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return (
            f"{self.cust_name}"
            f" - "
            f"{self.status}"
        )
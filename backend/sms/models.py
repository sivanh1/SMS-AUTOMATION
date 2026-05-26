from django.db import models

from customers.models import Customer

from django.contrib.auth.models import User


class SMSLog(models.Model):

    STATUS_CHOICES = (

        ('logged', 'Logged'),

        ('failed', 'Failed'),
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE
    )

    sent_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )

    message = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='logged'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return f"{self.customer.cust_name} - {self.status}"
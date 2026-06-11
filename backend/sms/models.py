# sms/models.py
from django.db import models
from django.contrib.auth.models import User

class SMSLog(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('logged', 'Logged'),
        ('failed', 'Failed'),
    )

    p_id = models.CharField(max_length=100)
    cust_name = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=20)
    extra_fields = models.JSONField(default=dict)

    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    # ── New field to store why it failed ──
    failure_reason = models.TextField(null=True, blank=True)

    sent_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    scheduled_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"[{self.status.upper()}] {self.cust_name} - {self.mobile_number}"

    class Meta:
        ordering = ['-created_at']
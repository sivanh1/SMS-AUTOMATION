from django.db import models

from django.contrib.auth.models import User


class Query(models.Model):

    PRIORITY_CHOICES = (

        ('low', 'Low'),

        ('medium', 'Medium'),

        ('high', 'High'),
    )

    STATUS_CHOICES = (

        ('open', 'Open'),

        ('in_progress', 'In Progress'),

        ('resolved', 'Resolved'),
    )

    title = models.CharField(
        max_length=255
    )

    description = models.TextField()

    priority = models.CharField(

        max_length=20,

        choices=PRIORITY_CHOICES,

        default='medium'
    )

    status = models.CharField(

        max_length=20,

        choices=STATUS_CHOICES,

        default='open'
    )

    created_by = models.ForeignKey(

        User,

        on_delete=models.CASCADE,

        related_name='queries'
    )

    admin_response = models.TextField(

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

        return self.title
from django.db import models

from django.contrib.auth.models import User

from django.db.models.signals import post_save

from django.dispatch import receiver


class UserProfile(models.Model):

    ROLE_CHOICES = (

        ('admin', 'Admin'),

        ('operator', 'Operator'),

    )

    user = models.OneToOneField(

        User,

        on_delete=models.CASCADE
    )

    role = models.CharField(

        max_length=20,

        choices=ROLE_CHOICES,

        default='operator'
    )

    def __str__(self):

        return self.user.username


# =========================================
# AUTO CREATE PROFILE
# =========================================

@receiver(post_save, sender=User)

def create_user_profile(

    sender,

    instance,

    created,

    **kwargs
):

    if created:

        role = "operator"

        if instance.is_superuser:

            role = "admin"

        UserProfile.objects.create(

            user=instance,

            role=role
        )
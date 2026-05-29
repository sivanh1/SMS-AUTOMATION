from rest_framework import serializers

from .models import SMSTemplate


class SMSTemplateSerializer(
    serializers.ModelSerializer
):

    created_by = serializers.SerializerMethodField()

    class Meta:

        model = SMSTemplate

        fields = [

            'id',

            'name',

            'body',

            'created_by',

            'created_at'

        ]

    def get_created_by(self, obj):

        if obj.created_by:

            return obj.created_by.username

        return "Unknown"
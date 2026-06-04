from rest_framework import serializers

from .models import SMSLog


class SMSLogSerializer(
    serializers.ModelSerializer
):

    sent_by = serializers.SerializerMethodField()

    class Meta:

        model = SMSLog

        fields = [

            'id',

            'p_id',

            'cust_name',

            'mobile_number',

            'extra_fields',

            'sent_by',

            'message',

            'status',

            'created_at'
        ]

    def get_sent_by(self, obj):

        if obj.sent_by:

            return {

                "username":
                obj.sent_by.username
            }

        return {

            "username":
            "Unknown"
        }
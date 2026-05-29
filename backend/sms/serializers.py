from rest_framework import serializers

from .models import SMSLog


class SMSLogSerializer(
    serializers.ModelSerializer
):

    customer = serializers.SerializerMethodField()

    sent_by = serializers.SerializerMethodField()

    class Meta:

        model = SMSLog

        fields = [

            'id',

            'customer',

            'sent_by',

            'message',

            'status',

            'created_at'

        ]

    def get_customer(self, obj):

        return {

            "p_id": obj.customer.p_id,

            "cust_name": obj.customer.cust_name,

            "mobile_number": obj.customer.mobile_number

        }

    def get_sent_by(self, obj):

        if obj.sent_by:

            return {

                "username": obj.sent_by.username

            }

        return {

            "username": "Unknown"

        }
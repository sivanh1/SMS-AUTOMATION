from rest_framework import serializers

from .models import Query


class QuerySerializer(
    serializers.ModelSerializer
):

    created_by = serializers.StringRelatedField()

    class Meta:

        model = Query

        fields = '__all__'
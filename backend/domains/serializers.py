from wsgiref import validate
from rest_framework import serializers
from .models import Trademark, Domain
from products.models import Product
from django.utils import timezone

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name"]

class TrademarkSerializer(serializers.ModelSerializer):
    #product = ProductSerializer()
    class Meta:
        model = Trademark
        fields = ["id", "name"]



class DomainSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get__type_display', read_only=True)
    trademark_data = TrademarkSerializer(source="trademark", read_only=True)
    class Meta:
        model = Domain
        fields = ["trademark", "domain", "_type", "created_at", "updated_at", "id", "type_display", "trademark_data"]
        read_only_fields = ["created_at", "updated_at", "id", "type_display", "trademark_data"]


    def create(self, validated_data):
        print(validated_data)
        return Domain.objects.create(**validated_data)


    def update(self, instance, validated_data):
        instance.domain = validated_data.get('domain', instance.domain)
        instance.trademark = validated_data.get('trademark', instance.trademark)
        instance._type = validated_data.get('_type', instance._type)
        instance.updated_at = timezone.now()
        instance.save()
        return instance


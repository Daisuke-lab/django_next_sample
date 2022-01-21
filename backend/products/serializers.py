from wsgiref import validate
from rest_framework import serializers
from .models import Genre, Product, Product_Condition
from django.shortcuts import get_object_or_404
from django.utils import timezone

class GenreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Genre
        fields = ["name"]
        
class ProductSerializer(serializers.ModelSerializer):
    #product_condition_title = serializers.CharField(max_length=200)
    class Meta:
        model = Product
        fields = ["user", "name", "memo", "genre", "product_condition"]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        return Product.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.user = validated_data.get('user', instance.user)
        instance.memo = validated_data.get('memo', instance.memo)
        instance.genre = validated_data.get('genre', instance.genre)
        instance.product_condition = validated_data.get('product_condition', instance.product_condition)
        instance.updated_at = timezone.now()
        instance.save()

        return instance

        
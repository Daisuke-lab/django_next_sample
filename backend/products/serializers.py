from wsgiref import validate
from rest_framework import serializers
from .models import Genre, Product, Product_Condition, Small_Genre
#from django.shortcuts import get_object_or_404
from config.helper import get_object_or_404
from django.utils import timezone
from rest_framework.validators import UniqueValidator
from users.models import User
from domains.models import Trademark

class GenreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Genre
        fields = ["name"]


class TrademarkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Trademark
        fields = ["name"]


class SmallGenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Small_Genre
        fields = ["name"]
        
        
class ProductSerializer(serializers.ModelSerializer):
    product_condition = serializers.CharField(max_length=200)
    small_genre = serializers.CharField(max_length=200)
    genre = serializers.CharField(max_length=200, source="small_genre.genre.name", read_only=True)
    trademarks = serializers.ListField(child=serializers.CharField(max_length=100), write_only=True)
    class Meta:
        model = Product
        fields = ["user", "name", "memo", "small_genre", "product_condition", "id", "created_at", "updated_at", "trademarks", "trademarks", "genre"]
        read_only_fields = ["id", 'created_at', 'updated_at', "trademarks", "genre"]
        extra_kwargs = {'memo': {'required': False}}

    def create(self, validated_data):
        print(validated_data)
        product_condition = get_object_or_404(Product_Condition, "product_condition", title=validated_data["product_condition"])
        small_genre = get_object_or_404(Small_Genre, "samll_genre", name=validated_data["small_genre"])
        product_data = {
            "user": validated_data["user"],
            "name": validated_data["name"],
            "memo": validated_data.get("memo"),
            "product_condition": product_condition,
            "small_genre": small_genre
        }
        product =  Product.objects.create(**product_data)
        for trademark_name in validated_data["trademarks"]:
            Trademark.objects.create(name=trademark_name, product=product)

        return product


    def update(self, instance, validated_data):
        product_condition = get_object_or_404(Product_Condition,"product_condition", title=validated_data["product_condition"])
        small_genre = get_object_or_404(Small_Genre, "small_genre", name=validated_data["small_genre"])
        instance.name = validated_data.get('name', instance.name)
        instance.user = validated_data.get('user', instance.user)
        instance.memo = validated_data.get('memo', instance.memo)
        instance.small_genre = small_genre
        instance.product_condition = product_condition
        self.update_trademarks(instance, validated_data["trademarks"])
        instance.updated_at = timezone.now()
        instance.save()

        return instance

    def to_representation(self, obj):
        self.fields['trademarks'] = serializers.SerializerMethodField()
        return super().to_representation(obj)

    def get_trademarks(self, obj):
        product = get_object_or_404(Product, "product", id=obj.id)
        trademarks = Trademark.objects.filter(product=product).values_list('name', flat=True)
        return trademarks

    def update_trademarks(self, instance, trademarks):
        if trademarks is not None:
            trademark_instances = list(instance.trademarks.values_list('name', flat=True))
            for trademark in trademarks:
                if trademark in trademark_instances:
                    pass
                else:
                    trademark = Trademark.objects.create(name=trademark, product=instance)
            instance.save()
            trademark_instances = list(instance.trademarks.values_list("id", 'name'))
            for trademark in trademark_instances:
                _id, name = trademark
                if name not in trademarks:
                    trademark = Trademark.objects.get(id=_id)
                    trademark.delete()

        
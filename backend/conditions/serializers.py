from enum import unique
from wsgiref import validate
from rest_framework import serializers
from .models import NG_Keyword, Composite_Keyword, NG_Keyword_Condition
from products.models import Product_Condition
from django.shortcuts import get_object_or_404

class NGKeywordConditionSerializer(serializers.ModelSerializer):
    front_check_word_count = serializers.IntegerField()
    back_check_word_count = serializers.IntegerField()
    ng_keyword = serializers.CharField(max_length=200)
    composite_keyword = serializers.CharField(max_length=200)
    check_target_period = serializers.IntegerField()
    period_unit = serializers.CharField(max_length=5)


class ProductConditionSerializer(serializers.ModelSerializer):
    ng_keyword_conditions = NGKeywordConditionSerializer(many=True, allow_null=True )
    title = serializers.CharField(max_length=100, unique=True)
    ng_keywords = serializers.ListField(child=serializers.CharField(max_length=100))
 

    def create(self, validated_data):
        product_condition = Product_Condition.objects.create(title=validated_data["title"])
        ng_keyword_conditions = validated_data["ng_keyword_conditions"]
        for ng_keyword_condition in ng_keyword_conditions:
            if ng_keyword_condition["ng_keyword"] == "全体":
                for ng_keyword in validated_data["ng_keywords"]:
                    self.create_ng_keyword_condition(ng_keyword, ng_keyword_condition, product_condition)
            else:
                self.create_ng_keyword_condition(ng_keyword_condition["ng_keyword"], ng_keyword_condition, product_condition)
        return product_condition

    def get_or_create_ng_keyword(self, ng_keyword_name):
        exist = NG_Keyword.objects.filter(name=ng_keyword_name).exists()

        if exist:
            ng_keyword = NG_Keyword.objects.get(name=ng_keyword_name)
        else:
            ng_keyword = NG_Keyword.objects.create(name=ng_keyword_name)

        return ng_keyword

    def get_or_create_composite_keyword(self, compsoite_keyword_name):
        exist = Composite_Keyword.objects.filter(name=compsoite_keyword_name).exists()

        if exist:
            composite_keyword = Composite_Keyword.objects.get(name=compsoite_keyword_name)
        else:
            composite_keyword = Composite_Keyword.objects.create(name=compsoite_keyword_name)

        return composite_keyword

    def create_ng_keyword_condition(self, ng_keyword_name, ng_keyword_condition, product_condition):
        composite_keyword = self.get_or_create_composite_keyword(ng_keyword_condition["composite_keyword"])
        ng_keyword = self.get_or_create_ng_keyword(ng_keyword_name)
        ng_keyword_condition_data = {
            "ng_keyword": ng_keyword,
            "composite_keyword": composite_keyword,
            "front_check_word_count": ng_keyword_condition["front_check_word_count"],
            "back_check_word_count": ng_keyword_condition["back_check_word_count"],
            "product_condition": product_condition
        }
        new_ng_keyword_condition = NG_Keyword_Condition.objects.create(**ng_keyword_condition_data)

        return new_ng_keyword_condition








    def update(self, instance, validated_data):
    

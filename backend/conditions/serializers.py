from enum import unique
from wsgiref import validate
from rest_framework import serializers
from .models import NG_Keyword, Composite_Keyword, NG_Keyword_Condition
from products.models import Product_Condition
from django.shortcuts import get_object_or_404
from django.utils import timezone


class NGKeywordConditionSerializer(serializers.ModelSerializer):
    front_check_word_count = serializers.IntegerField()
    back_check_word_count = serializers.IntegerField()
    ng_keyword = serializers.CharField(max_length=200)
    composite_keyword = serializers.CharField(max_length=200)
    check_target_period = serializers.IntegerField(write_only=True)
    period_unit = serializers.CharField(max_length=5, write_only=True)
    id = serializers.IntegerField(allow_null=True, required=False)

    class Meta:
        model = NG_Keyword_Condition
        fields = ["front_check_word_count", "back_check_word_count", "ng_keyword",
        "composite_keyword", "check_target_period", "period_unit", "id"]
        extra_kwargs = {'id': {'required': False}}



class ProductConditionSerializer(serializers.ModelSerializer):
    ng_keyword_conditions = NGKeywordConditionSerializer(many=True)
    title = serializers.CharField(max_length=100)
    ng_keywords = serializers.ListField(child=serializers.CharField(max_length=100), write_only=True)
    class Meta:
        model = Product_Condition
        fields = ["ng_keyword_conditions", "title", "ng_keywords", "id"]
        write_only_fields = ('ng_keywords',)
        read_only_fields = ["ng_keyword_conditions", "id"]
        extra_kwargs = {'ng_keyword_conditions': {'required': False}}

    def validate_title(self, value):
        print(self.context['request'].parser_context)
        kwargs = self.context['request'].parser_context["kwargs"]
        pk = kwargs.get('pk')
        if pk is None:#create
            if Product_Condition.objects.filter(title=value).exists():
                raise serializers.ValidationError(
                    "The specified title already exists"
                )
        else:#update
            if Product_Condition.objects.filter(title=value).exists():
                product_condition = Product_Condition.objects.get(title=value)
                if product_condition.id == pk:
                    pass
                else:
                    raise serializers.ValidationError(
                    "The specified title already exists"
                )

        return value
 

    def create(self, validated_data):
        product_condition = Product_Condition.objects.create(title=validated_data["title"])
        print(product_condition.__dict__)
        ng_keyword_conditions = validated_data.get("ng_keyword_conditions")
        ng_keyword_conditions = ng_keyword_conditions if ng_keyword_conditions is not None else []
        ng_keywords = validated_data.pop("ng_keywords")
        for ng_keyword_condition in ng_keyword_conditions:
            if ng_keyword_condition["ng_keyword"] == "全体":
                for ng_keyword in ng_keywords:
                    self.create_ng_keyword_condition(ng_keyword, ng_keyword_condition, product_condition)
            else:
                self.create_ng_keyword_condition(ng_keyword_condition["ng_keyword"], ng_keyword_condition, product_condition)
        print('you are')
        print(validated_data)
        return product_condition

    def create_ng_keyword_condition(self, ng_keyword_name, ng_keyword_condition, product_condition):
        print('you are here')
        composite_keyword,_ = Composite_Keyword.objects.get_or_create(name=ng_keyword_condition["composite_keyword"])
        ng_keyword,_ = NG_Keyword.objects.get_or_create(name=ng_keyword_name)
        ng_keyword_condition_data = {
            "ng_keyword": ng_keyword,
            "composite_keyword": composite_keyword,
            "front_check_word_count": ng_keyword_condition["front_check_word_count"],
            "back_check_word_count": ng_keyword_condition["back_check_word_count"],
            "product_condition": product_condition
        }
        print(ng_keyword_condition_data)
        new_ng_keyword_condition = NG_Keyword_Condition.objects.create(**ng_keyword_condition_data)

        return new_ng_keyword_condition


    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        ng_keyword_conditions = validated_data["ng_keyword_conditions"]
        for ng_keyword_condition in ng_keyword_conditions:
            if ng_keyword_condition["ng_keyword"] == "全体":
                for ng_keyword in validated_data["ng_keywords"]:
                    if ng_keyword_condition.get("id") is not None:
                        self.update_ng_keyword_condition(ng_keyword, ng_keyword_condition, instance)
                    else:
                        self.create_ng_keyword_condition(ng_keyword, ng_keyword_condition, instance)
            else:
                if ng_keyword_condition.get("id") is not None:
                        self.update_ng_keyword_condition(ng_keyword_condition["ng_keyword"], ng_keyword_condition, instance)
                else:
                    self.create_ng_keyword_condition(ng_keyword_condition["ng_keyword"], ng_keyword_condition, instance)

        instance.updated_at = timezone.now()
        instance.save()
        return instance

    def update_ng_keyword_condition(self, ng_keyword_name, ng_keyword_condition, product_condition):
        composite_keyword,_ = Composite_Keyword.objects.get_or_create(name=ng_keyword_condition["composite_keyword"])
        ng_keyword,_ = NG_Keyword.objects.get_or_create(name=ng_keyword_name)
        instance = get_object_or_404(NG_Keyword_Condition, id=ng_keyword_condition.get("id"))
        instance.ng_keyword = ng_keyword
        instance.composite_keyword = composite_keyword
        instance.front_check_word_count = ng_keyword_condition.get('front_check_word_count', instance.front_check_word_count)
        instance.back_check_word_count = ng_keyword_condition.get('back_check_word_count', instance.back_check_word_count)
        instance.product_condition = product_condition
        instance.updated_at = timezone.now()
        instance.save()
        return instance

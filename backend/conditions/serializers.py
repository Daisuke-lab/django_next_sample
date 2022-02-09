from enum import unique
from wsgiref import validate
from rest_framework import serializers
from .models import NG_Keyword, Composite_Keyword, NG_Keyword_Condition
from products.models import Product_Condition
from django.utils import timezone
from config.helper import get_object_or_404

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
    ng_keyword_conditions = NGKeywordConditionSerializer(many=True, default=[], allow_null=True)
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

    def to_representation(self, obj):
        self.fields['ng_keywords'] = serializers.SerializerMethodField()
        self.fields["ng_keyword_conditions"] = serializers.SerializerMethodField(read_only=True)
        return super().to_representation(obj)

    def get_ng_keywords(self, obj):
        ng_keywords = []
        product_condition = get_object_or_404(Product_Condition, "product_condition", id=obj.id)
        ng_keyword_conditions = NG_Keyword_Condition.objects.filter(product_condition=product_condition)
        for ng_keyword_condition in ng_keyword_conditions:
            ng_keywords.append(ng_keyword_condition.ng_keyword.name)
        return set(ng_keywords)

    def get_ng_keyword_conditions(self, obj):
        product_condition = get_object_or_404(Product_Condition, "product_condition", id=obj.id)
        ng_keyword_conditions = NG_Keyword_Condition.objects.filter(product_condition=product_condition,
        composite_keyword__isnull=False).values()
        return ng_keyword_conditions

    def create(self, validated_data):
        product_condition = Product_Condition.objects.create(title=validated_data["title"])
        product_condition = self._create(validated_data, product_condition)
        return product_condition

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        old_ng_keyword_conditions = NG_Keyword_Condition.objects.filter(product_condition=instance)
        old_ng_keyword_conditions.delete()
        instance = self._create(validated_data, instance)
        return instance

    def _create(self, validated_data, product_condition):
        ng_keyword_conditions = validated_data.get("ng_keyword_conditions")
        ng_keyword_conditions = ng_keyword_conditions if ng_keyword_conditions is not None else []
        remained_ng_keywords = validated_data["ng_keywords"]
        ng_keywords = validated_data.pop("ng_keywords")
        for ng_keyword_condition in ng_keyword_conditions:
            if ng_keyword_condition["ng_keyword"] == "全体":
                for ng_keyword in ng_keywords:
                    remained_ng_keywords.remove(ng_keyword) if ng_keyword in remained_ng_keywords else remained_ng_keywords
                    self.create_ng_keyword_condition(ng_keyword, product_condition, ng_keyword_condition)
            else:
                ng_keyword = ng_keyword_condition["ng_keyword"]
                remained_ng_keywords.remove(ng_keyword) if ng_keyword in remained_ng_keywords else remained_ng_keywords
                self.create_ng_keyword_condition(ng_keyword, product_condition, ng_keyword_condition)
        

        for ng_keyword in remained_ng_keywords:
            self.create_ng_keyword_condition(ng_keyword, product_condition)
        return product_condition

    def create_ng_keyword_condition(self, ng_keyword_name, product_condition, ng_keyword_condition=None):
        ng_keyword,_ = NG_Keyword.objects.get_or_create(name=ng_keyword_name)
        if ng_keyword_condition is not None:
            composite_keyword,_ = Composite_Keyword.objects.get_or_create(name=ng_keyword_condition["composite_keyword"])
            check_target_period = self.get_check_target_period(ng_keyword_condition["check_target_period"], ng_keyword_condition["period_unit"])
            
            ng_keyword_condition_data = {
                "ng_keyword": ng_keyword,
                "composite_keyword": composite_keyword,
                "front_check_word_count": ng_keyword_condition["front_check_word_count"],
                "back_check_word_count": ng_keyword_condition["back_check_word_count"],
                "product_condition": product_condition,
                "check_target_period": ng_keyword_condition["check_target_period"],
                "period_unit": ng_keyword_condition["period_unit"]
            }
        else:
            ng_keyword_condition_data = {
                "ng_keyword": ng_keyword,
                "product_condition": product_condition
            }
        new_ng_keyword_condition = NG_Keyword_Condition.objects.create(**ng_keyword_condition_data)

        return new_ng_keyword_condition

    def get_check_target_period(self, check_target_period, period_unit):
        if period_unit == "days":
            return check_target_period
        elif period_unit == "months":
            return check_target_period * 30
        elif period_unit == "years":
            return check_target_period * 365





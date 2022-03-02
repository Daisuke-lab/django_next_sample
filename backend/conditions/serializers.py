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
    id = serializers.IntegerField(allow_null=True, required=False)

    class Meta:
        model = NG_Keyword_Condition
        fields = ["front_check_word_count", "back_check_word_count", "ng_keyword",
        "composite_keyword", "id"]
        extra_kwargs = {'id': {'required': False}}





class ProductConditionSerializer(serializers.ModelSerializer):
    ng_keyword_conditions = NGKeywordConditionSerializer(many=True, default=[], allow_null=True)
    title = serializers.CharField(max_length=100)
    ng_keywords = serializers.ListField(child=serializers.CharField(max_length=100), write_only=True)
    class Meta:
        model = Product_Condition
        fields = ["ng_keyword_conditions", "title", "ng_keywords", "id", "user", "period_unit", "check_target_period"]
        write_only_fields = ('ng_keywords',)
        read_only_fields = ["ng_keyword_conditions", "id"]
        extra_kwargs = {'ng_keyword_conditions': {'required': False}}


    def validate_title(self, value):
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
        for ng_keyword_condition in ng_keyword_conditions:
            ng_keyword = get_object_or_404(NG_Keyword, "ng_keyword",id=ng_keyword_condition["ng_keyword_id"])
            composite_keyword = get_object_or_404(Composite_Keyword, "composite_keyword",id=ng_keyword_condition["composite_keyword_id"])
            ng_keyword_condition["ng_keyword"] = ng_keyword.name
            ng_keyword_condition["composite_keyword"] = composite_keyword.name
        return ng_keyword_conditions

    def create(self, validated_data):
        product_condition = Product_Condition.objects.create(title=validated_data["title"],
         user=validated_data["user"],
         check_target_period=validated_data["check_target_period"],
         period_unit=validated_data["period_unit"])
        product_condition = self._create(validated_data, product_condition)
        return product_condition

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.check_target_period = validated_data.get('check_target_period', instance.check_target_period)
        instance.period_unit = validated_data.get("period_unit", instance.period_unit)
        old_ng_keyword_conditions = NG_Keyword_Condition.objects.filter(product_condition=instance)
        old_ng_keyword_conditions.delete()
        instance = self._create(validated_data, instance)
        instance.save()
        return instance

    def _create(self, validated_data, product_condition):
        ng_keyword_conditions = validated_data.get("ng_keyword_conditions")
        ng_keyword_conditions = ng_keyword_conditions if ng_keyword_conditions is not None else []
        remained_ng_keywords = [ng_keyword for ng_keyword in validated_data["ng_keywords"]]
        ng_keywords = validated_data.pop("ng_keywords")
        for ng_keyword_condition in ng_keyword_conditions:
            if ng_keyword_condition["ng_keyword"] == "全体":
                print(ng_keywords)
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
            
            ng_keyword_condition_data = {
                "ng_keyword": ng_keyword,
                "composite_keyword": composite_keyword,
                "front_check_word_count": ng_keyword_condition["front_check_word_count"],
                "back_check_word_count": ng_keyword_condition["back_check_word_count"],
                "product_condition": product_condition
            }
        else:
            ng_keyword_condition_data = {
                "ng_keyword": ng_keyword,
                "product_condition": product_condition
            }
        new_ng_keyword_condition = NG_Keyword_Condition.objects.create(**ng_keyword_condition_data)

        return new_ng_keyword_condition






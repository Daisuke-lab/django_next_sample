from rest_framework import serializers
from domains.models import Trademark
from config.helper import get_object_or_404
from .models import Check_Result
from products.models import Product
#from domains.serializers import TrademarkSerializer
from django.db.models import Sum, Q, Count
from products.serializers import GenreSerializer
from config.helper import get_object_or_404

class ProductResultSerializer(serializers.ModelSerializer):
    trademarks = serializers.SerializerMethodField()
    latest_check_datetime = serializers.SerializerMethodField()
    priorities = serializers.SerializerMethodField()
    genre = serializers.CharField(max_length=2000, source="small_genre.genre.name")
    small_genre = serializers.CharField(max_length=2000, source="small_genre.name")
    product_name = serializers.CharField(max_length=200, source="name")
    class Meta:
        model = Product
        fields = ["id", "product_name", "latest_check_datetime", "genre", "small_genre", "priorities", "trademarks"]


    def get_trademarks(self, obj):
        trademarks = Trademark.objects.filter(product=obj.id).values_list('name', flat=True)
        return trademarks
    def get_latest_check_datetime(self, obj):
        results = Check_Result.objects.filter(url__domain__trademark__product__id=obj.pk)

        if len(results) > 0:
            latest_result_created_at = results.latest("created_at").created_at
        else: 
            latest_result_created_at = None
        return latest_result_created_at

    def get_priorities(self, obj):
        results = Check_Result.objects.filter(url__domain__trademark__product__id=obj.pk).annotate(
            high=Count('priority', filter=Q(priority=1)),
            middle=Count('priority', filter=Q(priority=2)),
            low=Count('priority', filter=Q(priority=3)),
            unknown=Count('priority', filter=Q(priority=4)))
        if len(results) == 0:
            return None
        else:
            result = results[0]
            sum = result.high + result.middle + result.low + result.unknown
            return {
                "high": result.high,
                "middle": result.middle,
                "low": result.low,
                "unknown": result.unknown,
                "sum": sum
            }


class CheckResultSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source="url.url", read_only=True)
    domain = serializers.CharField(source="url.domain.domain", read_only=True)
    ng_keywords = serializers.SerializerMethodField()
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)

    class Meta:
        model = Check_Result
        fields = ["id", "domain", "url", "ng_keywords", "priority_display", "confirmed", "priority"]
        read_only_fields = ["id", "domain", "url", "ng_keywords", "priority_display","priority"]


    def get_ng_keywords(self, obj):
        check_result = get_object_or_404(Check_Result, "check_result", id=obj.pk)
        product = check_result.url.domain.trademark.product
        ng_keyword_conditions = product.product_condition.ng_keyword_conditions.all()
        ng_keywords = []
        for ng_keyword_condition in ng_keyword_conditions:
            ng_keywords.append(ng_keyword_condition.ng_keyword.name)
        return ng_keywords

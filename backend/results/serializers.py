from rest_framework import serializers
from domains.models import Trademark
from config.helper import get_object_or_404
from .models import Check_Result
from products.models import Product
#from domains.serializers import TrademarkSerializer
from django.db.models import Sum, Q, Count
from products.serializers import GenreSerializer
from config.helper import get_object_or_404

class ProductSerializer(serializers.ModelSerializer):
    trademarks = serializers.SerializerMethodField()
    latest_check_date = serializers.SerializerMethodField()
    priorities = serializers.SerializerMethodField()
    genre = serializers.CharField(max_length=2000, source="genre.name")
    product_name = serializers.CharField(max_length=200, source="name")
    class Meta:
        model = Product
        fields = ["id", "product_name", "latest_check_date", "genre", "priorities", "trademarks"]


    def get_trademarks(self, obj):
        trademarks = Trademark.objects.filter(product=obj.id).values_list('name', flat=True)
        return trademarks
    def get_latest_check_date(self, obj):
        latest_result = Check_Result.objects.filter(url__domain__trademark__product__id=obj.pk).latest("created_at")
        return latest_result.created_at

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
    url = serializers.CharField(source="url.url")
    domain = serializers.CharField(source="url.domain.domain")
    ng_keywords = serializers.SerializerMethodField()
    priority_display = serializers.CharField(source='get__priority_display', read_only=True)
    
    class Meta:
        model = Check_Result
        fields = ["id", "domain", "url", "ng_keywords", "priority_display", "confirmed"]


    def get_ng_keywords(self, obj):
        check_result = get_object_or_404(Check_Result, "check_result", id=obj.pk)
        product = check_result.url.domain.trademark.product
        ng_keyword_conditions = product.product_condition.ng_keyword_conditions.all()
        ng_keywords = []
        for ng_keyword_condition in ng_keyword_conditions:
            ng_keywords.append(ng_keyword_condition.ng_keyword.name)
        return ng_keywords

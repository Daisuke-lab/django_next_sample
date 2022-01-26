from rest_framework import serializers
from domains.models import Trademark
from config.helper import get_object_or_404
from .models import Check_Result
from products.models import Product
#from domains.serializers import TrademarkSerializer
from django.db.models import Sum, Q, Count
from products.serializers import GenreSerializer
class CheckResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = Check_Result
        fields = ["id", "url"]

class TrademarkSerializer(serializers.ModelSerializer):

    name = serializers.CharField(max_length=200)

    class Meta:
        model = Trademark
        fields=["name"]
class ProductSerializer(serializers.ModelSerializer):
    #trademarks = TrademarkSerializer(read_only=True, many=True)
    #rademarks = serializers.ListField(child=serializers.CharField(max_length=200))
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

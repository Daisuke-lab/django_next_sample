from django_filters import rest_framework as filters

from products.models import Product
from .models import Check_Result


class ProductResultFilter(filters.FilterSet):
    created_at__gt = filters.DateTimeFilter(field_name='created_at', lookup_expr='gt')
    created_at__lt = filters.DateTimeFilter(field_name='created_at', lookup_expr='lt')
    user = filters.CharFilter(field_name="user__id")
    class Meta:
        model = Product
        fields = ["created_at__gt", "created_at__lt", "user"]


class InListFilter(filters.Filter):

    def filter(self, qs, value):
        if value:
            return qs.filter(**{self.field_name+'__in': value.split(',')})
        return qs


class CheckResultFilter(filters.FilterSet):
    user = filters.CharFilter(field_name="url__domain__trademark__product__user__id")
    product_id = filters.NumberFilter(field_name="url__domain__trademark__product__id")
    domain = filters.CharFilter(field_name='url__domain__domain')
    priority = InListFilter(field_name="priority")
    confirmed = InListFilter(field_name="confirmed")
    class Meta:
        model = Check_Result
        fields = ["id", "domain", "product_id", "priority", "user"]
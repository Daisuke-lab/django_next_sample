from django_filters import rest_framework as filters

from products.models import Product
from .models import Check_Result


class LatestCheckDatetimeFilter(filters.Filter):

    def filter(self, qs, value):
        if value:
            product_ids = Check_Result.objects.filter(
                **{f'created_at__{self.lookup_expr}': value}
                ).values_list('url__domain__trademark__product__id', flat=True)
            return qs.filter(id__in=product_ids)
        return qs

class ProductResultFilter(filters.FilterSet):
    latest_check_datetime__gte = LatestCheckDatetimeFilter(lookup_expr='gte')
    latest_check_datetime__lte = LatestCheckDatetimeFilter(lookup_expr='lte')
    user = filters.CharFilter(field_name="user__id")
    class Meta:
        model = Product
        fields = ["latest_check_datetime__gte", "latest_check_datetime__lte", "user"]


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
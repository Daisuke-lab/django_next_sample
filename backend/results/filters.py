from django_filters import rest_framework as filters
from .models import Check_Result


class CheckResultFilter(filters.FilterSet):
    product_id = filters.NumberFilter(field_name="url__domain__trademark__product__id")
    url = filters.CharFilter(field_name='url__url')
    class Meta:
        model = Check_Result
        fields = ["id", "url", "product_id"]
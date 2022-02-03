from django_filters import rest_framework as filters
from products.models import Product_Condition

class ProductConditionFilter(filters.FilterSet):
    created_at__gt = filters.DateTimeFilter(field_name='created_at', lookup_expr='gt')
    created_at__lt = filters.DateTimeFilter(field_name='created_at', lookup_expr='lt')
    composite_keyword_is_null= filters.BooleanFilter(field_name="ng_keyword_conditions__composite_keyword", lookup_expr="isnull")
    class Meta:
        model = Product_Condition
        fields = ["created_at__gt", "created_at__lt", "composite_keyword_is_null"]
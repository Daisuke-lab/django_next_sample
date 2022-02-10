from django_filters import rest_framework as filters
from products.models import Product_Condition

class ProductConditionFilter(filters.FilterSet):
    user = filters.CharFilter(field_name="user__id")
    class Meta:
        model = Product_Condition
        fields = ["user"]
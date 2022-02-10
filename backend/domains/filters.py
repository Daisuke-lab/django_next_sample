from django_filters import rest_framework as filters

from .models import Domain, Trademark


class DomainFilter(filters.FilterSet):
    user = filters.CharFilter(field_name="trademark__product__user__id")
    class Meta:
        model = Domain
        fields = ["user"]

class TrademarkFilter(filters.FilterSet):
    user = filters.CharFilter(field_name="product__user__id")
    class Meta:
        model = Trademark
        fields = ["user"]
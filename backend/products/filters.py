from django_filters import rest_framework as filters

from .models import Small_Genre, Product


class SmallGenreFilter(filters.FilterSet):
    genre = filters.CharFilter(field_name="genre__name")
    class Meta:
        model = Small_Genre
        fields = ["genre"]

class ProductFilter(filters.FilterSet):
    user = filters.CharFilter(field_name="user__id")
    class Meta:
        model = Product
        fields = ["user"]

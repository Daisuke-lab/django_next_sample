from django.shortcuts import render
from rest_framework.response import Response
from results.models import Check_Result
from .serializers import ProductResultSerializer, CheckResultSerializer
from rest_framework import generics
from products.models import Product
from rest_framework.permissions import AllowAny
from .filters import CheckResultFilter, ProductResultFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
import django_filters.rest_framework
from .orderings import ProductResultOrdering
class ListProductResult(generics.ListAPIView):
    queryset = Product.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductResultSerializer
    filterset_class = ProductResultFilter
    pagination_class = PageNumberPagination
    filter_backends = [filters.OrderingFilter, django_filters.rest_framework.DjangoFilterBackend]
    ordering_fields = ["created_at","small_genre__name", "small_genre__genre__name", "name"]

class ListCheckResult(generics.ListAPIView):
    queryset = Check_Result.objects.all()
    permission_classes = [AllowAny]
    serializer_class = CheckResultSerializer
    filterset_class = CheckResultFilter
    pagination_class = PageNumberPagination
    filter_backends = [filters.OrderingFilter, django_filters.rest_framework.DjangoFilterBackend]
    ordering_fields = ["created_at","url__domain__domain", "url__url", "priority", "confirmed"]


class RetrieveUpdateDestroyCheckResult(generics.RetrieveUpdateDestroyAPIView):
    queryset = Check_Result.objects.all()
    permission_classes = [AllowAny]
    serializer_class = CheckResultSerializer





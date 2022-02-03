from django.shortcuts import render
from rest_framework import generics
from products.models import Product_Condition
from rest_framework.permissions import AllowAny
from .serializers import ProductConditionSerializer
from rest_framework.response import Response
from .filters import ProductConditionFilter
from rest_framework.pagination import PageNumberPagination

class ListProductCondition(generics.ListAPIView):
    queryset = Product_Condition.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductConditionSerializer
    

class ListCreateProductCondition(generics.ListCreateAPIView):
    queryset = Product_Condition.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductConditionSerializer
    pagination_class = PageNumberPagination


class RetrieveUpdateDestroyProductCondition(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product_Condition.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductConditionSerializer

from django.shortcuts import render
from .serializers import ProductSerializer
from rest_framework import generics
from products.models import Product
from rest_framework.permissions import AllowAny


class ListResult(generics.ListAPIView):
    queryset = Product.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer




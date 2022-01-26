from django.shortcuts import render
from rest_framework.response import Response
from results.models import Check_Result
from .serializers import ProductSerializer, CheckResultSerializer
from rest_framework import generics
from products.models import Product
from rest_framework.permissions import AllowAny
from .filters import CheckResultFilter


class ListResult(generics.ListAPIView):
    queryset = Product.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer

class ListCheckResult(generics.ListAPIView):
    queryset = Check_Result.objects.all()
    permission_classes = [AllowAny]
    serializer_class = CheckResultSerializer
    filterset_class = CheckResultFilter





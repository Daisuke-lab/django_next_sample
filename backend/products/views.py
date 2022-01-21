from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from .serializers import ProductSerializer, GenreSerializer
from .models import Product, Genre


class ListCreateProduct(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer


class RetrieveUpdateDestroyProduct(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer

class ListCreateGenre(generics.ListCreateAPIView):
    queryset = Genre.objects.all()
    permission_classes = [AllowAny]
    serializer_class = GenreSerializer


class RetrieveUpdateDestroyGenre(generics.RetrieveUpdateDestroyAPIView):
    queryset = Genre.objects.all()
    permission_classes = [AllowAny]
    serializer_class = GenreSerializer
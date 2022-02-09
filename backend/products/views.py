from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from .serializers import ProductSerializer, GenreSerializer, SmallGenreSerializer
from .models import Product, Genre, Small_Genre
from rest_framework.pagination import PageNumberPagination
from .filters import SmallGenreFilter

class ListCreateProduct(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer
    pagination_class = PageNumberPagination


class RetrieveUpdateDestroyProduct(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer

class ListCreateGenre(generics.ListCreateAPIView):
    queryset = Genre.objects.all()
    permission_classes = [AllowAny]
    serializer_class = GenreSerializer

class ListCreateSmallGenre(generics.ListCreateAPIView):
    queryset = Small_Genre.objects.all()
    permission_classes = [AllowAny]
    serializer_class = SmallGenreSerializer
    filterset_class = SmallGenreFilter

class RetrieveUpdateDestroyGenre(generics.RetrieveUpdateDestroyAPIView):
    queryset = Genre.objects.all()
    permission_classes = [AllowAny]
    serializer_class = GenreSerializer
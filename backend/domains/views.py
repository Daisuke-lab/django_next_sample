from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import TrademarkSerializer, DomainSerializer
from .models import Trademark, Domain
from rest_framework.pagination import PageNumberPagination
from .filters import DomainFilter, TrademarkFilter
class ListCreateTrademark(generics.ListCreateAPIView):
    queryset = Trademark.objects.all()
    permission_classes = [AllowAny]
    serializer_class = TrademarkSerializer
    filterset_class = TrademarkFilter



class RetrieveUpdateDestroyTrademark(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trademark.objects.all()
    permission_classes = [AllowAny]
    serializer_class = TrademarkSerializer



class ListCreateDomain(generics.ListCreateAPIView):
    queryset = Domain.objects.all()
    permission_classes = [AllowAny]
    serializer_class = DomainSerializer
    pagination_class = PageNumberPagination
    filterset_class = DomainFilter


class RetrieveUpdateDestroyDomain(generics.RetrieveUpdateDestroyAPIView):
    queryset = Domain.objects.all()
    permission_classes = [AllowAny]
    serializer_class = DomainSerializer
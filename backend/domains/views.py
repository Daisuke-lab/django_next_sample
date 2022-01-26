from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import TrademarkSerializer, DomainSerializer
from .models import Trademark, Domain


class ListCreateTrademark(generics.ListCreateAPIView):
    queryset = Trademark.objects.all()
    permission_classes = [AllowAny]
    serializer_class = TrademarkSerializer


class RetrieveUpdateDestroyTrademark(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trademark.objects.all()
    permission_classes = [AllowAny]
    serializer_class = TrademarkSerializer



class ListCreateDomain(generics.ListCreateAPIView):
    queryset = Domain.objects.all()
    permission_classes = [AllowAny]
    serializer_class = DomainSerializer


class RetrieveUpdateDestroyDomain(generics.RetrieveUpdateDestroyAPIView):
    queryset = Domain.objects.all()
    permission_classes = [AllowAny]
    serializer_class = DomainSerializer
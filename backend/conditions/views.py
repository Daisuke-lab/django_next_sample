from django.shortcuts import render
from rest_framework import generics
from products.models import Product_Condition
from rest_framework.permissions import AllowAny
from .serializers import ProductConditionSerializer
from rest_framework.response import Response

class ListCreateProductCondition(generics.ListCreateAPIView):
    queryset = Product_Condition.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductConditionSerializer

    def get(self, request, *args, **kwargs):
        product_condition = Product_Condition.objects.get(id=24)
        print(product_condition.__dict__)
        print(product_condition.ng_keyword_conditions.all())
        return self.list(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        print(queryset)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class RetrieveUpdateDestroyProductCondition(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product_Condition.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductConditionSerializer

from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from .models import User
from .serializers import UserSerializer
class UpdateUser(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
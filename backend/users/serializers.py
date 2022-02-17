from wsgiref import validate
from rest_framework import serializers
from .models import User
#from django.shortcuts import get_object_or_404
from config.helper import get_object_or_404
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["mc_id"]

    def update(self, instance, validated_data):
        instance.mc_id = validated_data.get('mc_id', instance.mc_id)
        instance.save()
        return instance
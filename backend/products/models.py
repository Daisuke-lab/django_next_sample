import imp
from django.db import models
from users.models import User
from domains.models import Trademark
from conditions.models import NG_Keyword, NG_Keyword_Condition
import uuid

class Genre(models.Model):
    name = models.CharField(max_length=200, unique=True)
    class Meta:
        db_table = 'genre'

    def __str__(self):
        return self.name

class Small_Genre(models.Model):
    name = models.CharField(max_length=200, unique=True)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    class Meta:
        db_table = 'small_genre'

    def __str__(self):
        return self.name


class Product_Condition(models.Model):
    title = models.CharField(unique=True, max_length=500)
    status = models.IntegerField(default=1)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    class Meta:
        db_table = 'product_condition'

    def __str__(self):
        return self.title

class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    memo = models.TextField(null=True)
    small_genre = models.ForeignKey(Small_Genre, on_delete=models.CASCADE)
    status = models.IntegerField(default=1)
    product_condition = models.ForeignKey(Product_Condition, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = 'product'



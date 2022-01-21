from pyexpat import model
from django.db import models
from domains.models import Domain

class Url(models.Model):
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE)
    url = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeFiled(auto_now=True)
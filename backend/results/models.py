from django.db import models
from domains.models import Url


class Check_Result(models.Model):
    url = models.ForeignKey(Url, on_delete=models.CASCADE)
    priority = models.IntegerField()
    confirmed = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = 'check_result'

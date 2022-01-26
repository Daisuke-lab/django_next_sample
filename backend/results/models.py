from django.db import models
from domains.models import Url
choices = (
            (1, '高'),
            (2, '中'),
            (3, '低'),
            (4, '判定中'),

        )

class Check_Result(models.Model):
    url = models.ForeignKey(Url, on_delete=models.CASCADE)
    priority = models.IntegerField(choices=choices)
    confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = 'check_result'

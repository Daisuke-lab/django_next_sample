from django.db import models

class Trademark(models.Model):
    name = models.CharField(max_length=200)
    status = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = 'trademark'


class Domain(models.Model):
    trademark = models.ForeignKey(Trademark, on_delete=models.CASCADE)
    domain = models.TextField(max_length=200)
    status = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = 'domain'

class Url(models.Model):
    url = models.TextField(max_length=200)
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = 'url'






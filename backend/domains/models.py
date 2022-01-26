from django.db import models


choices = (
            (1, '除外'),
            (2, '必須')
        )


class Trademark(models.Model):
    name = models.CharField(max_length=200)
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE, related_name="trademarks")
    status = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = 'trademark'

    def __str__(self):
        return self.name


class Domain(models.Model):
    trademark = models.ForeignKey(Trademark, on_delete=models.CASCADE)
    _type = models.IntegerField(choices=choices)
    domain = models.TextField(max_length=200)
    status = models.IntegerField(default=1)
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






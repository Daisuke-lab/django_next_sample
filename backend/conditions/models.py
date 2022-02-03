from django.db import models
import uuid
#from products.models import Product_Condition
class Composite_Keyword(models.Model):
    name = models.CharField(max_length=200)
    status = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    class Meta:
        db_table = 'composite_keyword'

class NG_Keyword(models.Model):
    name = models.CharField(max_length=200)
    status = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name
    class Meta:
        db_table = 'ng_keyword'

class NG_Keyword_Condition(models.Model):
    ng_keyword = models.ForeignKey(NG_Keyword, on_delete=models.CASCADE)
    composite_keyword = models.ForeignKey(Composite_Keyword, on_delete=models.CASCADE, null=True)
    product_condition = models.ForeignKey("products.Product_Condition", on_delete=models.CASCADE,
    related_name="ng_keyword_conditions")
    front_check_word_count = models.IntegerField(null=True)
    back_check_word_count = models.IntegerField(null=True)
    status = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = 'ng_keyword_condition'



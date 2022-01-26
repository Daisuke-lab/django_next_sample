# Generated by Django 3.2.10 on 2022-01-25 04:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_auto_20220125_1136'),
        ('domains', '0004_alter_trademark_product'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trademark',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trademarks', to='products.product'),
        ),
    ]
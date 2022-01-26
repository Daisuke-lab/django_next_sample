# Generated by Django 3.2.10 on 2022-01-25 04:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_auto_20220125_1136'),
        ('domains', '0003_alter_trademark_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trademark',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.product'),
        ),
    ]
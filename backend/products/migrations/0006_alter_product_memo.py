# Generated by Django 3.2.10 on 2022-02-03 05:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_auto_20220125_1136'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='memo',
            field=models.TextField(null=True),
        ),
    ]

# Generated by Django 3.2.10 on 2022-01-20 04:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conditions', '0004_auto_20220119_1749'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ng_keyword_condition',
            name='status',
            field=models.IntegerField(default=1),
        ),
    ]

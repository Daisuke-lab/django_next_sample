# Generated by Django 3.2.10 on 2022-01-20 04:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conditions', '0005_alter_ng_keyword_condition_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='composite_keyword',
            name='status',
            field=models.IntegerField(default=1),
        ),
    ]

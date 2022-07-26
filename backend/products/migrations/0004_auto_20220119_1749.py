# Generated by Django 3.2.10 on 2022-01-19 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_alter_product_condition_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='condition',
            new_name='product_condition',
        ),
        migrations.RemoveField(
            model_name='product_condition',
            name='ng_keywords',
        ),
        migrations.AddField(
            model_name='product_condition',
            name='title',
            field=models.CharField(default=None, max_length=500, unique=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='product_condition',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='product_condition',
            name='status',
            field=models.IntegerField(default=1),
        ),
    ]

# Generated by Django 3.1.8 on 2021-05-07 23:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dispatch', '0104_auto_20210507_1203'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='person',
            index=models.Index(fields=['full_name'], name='dispatch_pe_full_na_4f40f6_idx'),
        ),
    ]

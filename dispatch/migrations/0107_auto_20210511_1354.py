# Generated by Django 3.1.8 on 2021-05-11 20:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dispatch', '0106_auto_20210511_1238'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='subsection',
            index=models.Index(fields=['slug', 'section'], name='dispatch_su_slug_27e9d6_idx'),
        ),
    ]
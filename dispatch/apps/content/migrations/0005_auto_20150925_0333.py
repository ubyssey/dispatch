# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0004_auto_20150917_0401'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='published_head',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='page',
            name='published_head',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='article',
            name='created_at',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='page',
            name='created_at',
            field=models.DateTimeField(),
        ),
    ]

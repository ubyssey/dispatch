# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0002_auto_20150724_1814'),
    ]

    operations = [
        migrations.AddField(
            model_name='imagegallery',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 24, 18, 52, 11, 196252, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='imagegallery',
            name='updated_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 24, 18, 52, 21, 337665, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
    ]

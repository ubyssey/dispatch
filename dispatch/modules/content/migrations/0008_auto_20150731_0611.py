# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0007_auto_20150731_0355'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='num_ratings',
        ),
        migrations.RemoveField(
            model_name='comment',
            name='total_rating',
        ),
        migrations.AddField(
            model_name='comment',
            name='votes',
            field=models.PositiveIntegerField(default=0),
        ),
    ]

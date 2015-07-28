# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0004_auto_20150728_0522'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='last_used',
            field=models.DateTimeField(null=True),
        ),
    ]

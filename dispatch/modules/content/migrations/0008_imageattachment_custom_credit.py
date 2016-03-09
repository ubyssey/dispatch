# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0007_auto_20150925_0414'),
    ]

    operations = [
        migrations.AddField(
            model_name='imageattachment',
            name='custom_credit',
            field=models.TextField(null=True, blank=True),
        ),
    ]

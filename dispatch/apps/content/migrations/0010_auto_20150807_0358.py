# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    operations = [
        migrations.AddField(
            model_name='article',
            name='seo_description',
            field=models.CharField(max_length=250, null=True),
        ),
        migrations.AddField(
            model_name='article',
            name='seo_keyword',
            field=models.CharField(max_length=100, null=True),
        ),
    ]

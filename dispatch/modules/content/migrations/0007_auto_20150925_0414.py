# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0006_auto_20150925_0353'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='article',
            name='published_head',
        ),
        migrations.RemoveField(
            model_name='page',
            name='published_head',
        ),
    ]

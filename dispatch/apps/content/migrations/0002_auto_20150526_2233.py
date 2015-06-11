# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='author',
            name='article',
            field=models.ForeignKey(to='content.Article', null=True),
        ),
        migrations.AlterField(
            model_name='author',
            name='image',
            field=models.ForeignKey(to='content.Image', null=True),
        ),
    ]

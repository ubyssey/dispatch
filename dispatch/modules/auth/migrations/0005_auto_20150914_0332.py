# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_person_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='person',
            name='description',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='person',
            name='slug',
            field=models.SlugField(null=True, blank=True),
        ),
    ]

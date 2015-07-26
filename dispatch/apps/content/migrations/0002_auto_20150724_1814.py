# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imagegallery',
            name='images',
            field=models.ManyToManyField(to='content.ImageAttachment'),
        ),
    ]

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0003_auto_20150724_1852'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='article',
            name='topics',
        ),
        migrations.AddField(
            model_name='article',
            name='topic',
            field=models.ForeignKey(to='content.Topic', null=True),
        ),
        migrations.AlterField(
            model_name='imagegallery',
            name='images',
            field=models.ManyToManyField(related_name='images', to='content.ImageAttachment'),
        ),
    ]

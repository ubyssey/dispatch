# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0003_auto_20150917_0358'),
    ]

    operations = [
        migrations.AlterField(
            model_name='page',
            name='parent',
            field=models.ForeignKey(related_name='page_parent', blank=True, to='content.Page', null=True),
        ),
    ]

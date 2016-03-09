# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0002_page_published_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='page',
            name='parent_page',
            field=models.ForeignKey(related_name='parent_page_fk', to='content.Page', null=True),
        ),
    ]

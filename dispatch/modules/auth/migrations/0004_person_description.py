# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20150913_0256'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='description',
            field=models.TextField(null=True),
        ),
    ]

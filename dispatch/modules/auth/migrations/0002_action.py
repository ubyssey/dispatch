# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Action',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('action', models.CharField(max_length=50)),
                ('object_type', models.CharField(max_length=50)),
                ('object_id', models.PositiveIntegerField()),
                ('timestamp', models.DateTimeField(auto_now=True)),
                ('person', models.ForeignKey(to='core.Person')),
            ],
        ),
    ]

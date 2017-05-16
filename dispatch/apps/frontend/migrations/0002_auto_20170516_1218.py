# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-05-16 19:18
from __future__ import unicode_literals

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Zone',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('zone_id', models.SlugField()),
                ('widget_id', models.SlugField()),
                ('data', jsonfield.fields.JSONField()),
            ],
        ),
        migrations.RemoveField(
            model_name='component',
            name='fields',
        ),
        migrations.RemoveField(
            model_name='componentset',
            name='components',
        ),
        migrations.DeleteModel(
            name='Component',
        ),
        migrations.DeleteModel(
            name='ComponentField',
        ),
        migrations.DeleteModel(
            name='ComponentSet',
        ),
    ]

# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-24 18:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Component',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.CharField(max_length=50)),
                ('spot', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='ComponentField',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('value', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='ComponentSet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField()),
                ('components', models.ManyToManyField(to='frontend.Component')),
            ],
        ),
        migrations.CreateModel(
            name='TemplateVariable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('article_id', models.IntegerField()),
                ('template_slug', models.CharField(max_length=255)),
                ('variable', models.CharField(max_length=50)),
                ('value', models.TextField()),
            ],
        ),
        migrations.AddField(
            model_name='component',
            name='fields',
            field=models.ManyToManyField(to='frontend.ComponentField'),
        ),
    ]

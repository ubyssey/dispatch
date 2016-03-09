# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Component',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('slug', models.CharField(max_length=50)),
                ('spot', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='ComponentField',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
                ('value', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='FileResource',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('slug', models.SlugField()),
                ('components', models.ManyToManyField(to='frontend.Component')),
            ],
        ),
        migrations.CreateModel(
            name='TemplateVariable',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('article_id', models.IntegerField()),
                ('template_slug', models.CharField(max_length=255)),
                ('variable', models.CharField(max_length=50)),
                ('value', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Script',
            fields=[
                ('fileresource_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='frontend.FileResource')),
                ('source', models.FileField(upload_to=b'scripts')),
            ],
            bases=('frontend.fileresource',),
        ),
        migrations.CreateModel(
            name='Snippet',
            fields=[
                ('fileresource_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='frontend.FileResource')),
                ('source', models.FileField(upload_to=b'snippets')),
            ],
            bases=('frontend.fileresource',),
        ),
        migrations.CreateModel(
            name='Stylesheet',
            fields=[
                ('fileresource_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='frontend.FileResource')),
                ('source', models.FileField(upload_to=b'stylesheets')),
            ],
            bases=('frontend.fileresource',),
        ),
        migrations.AddField(
            model_name='component',
            name='fields',
            field=models.ManyToManyField(to='frontend.ComponentField'),
        ),
    ]

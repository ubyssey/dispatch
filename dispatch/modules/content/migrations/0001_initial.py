# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '__first__'),
        ('core', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('preview', models.BooleanField(default=False)),
                ('revision_id', models.PositiveIntegerField(default=0)),
                ('head', models.BooleanField(default=False)),
                ('long_headline', models.CharField(max_length=200)),
                ('short_headline', models.CharField(max_length=100)),
                ('is_active', models.BooleanField(default=True)),
                ('is_published', models.BooleanField(default=False)),
                ('published_at', models.DateTimeField()),
                ('slug', models.SlugField()),
                ('shares', models.PositiveIntegerField(default=0, null=True, blank=True)),
                ('importance', models.PositiveIntegerField(default=3, choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)], validators=[django.core.validators.MaxValueValidator(5)])),
                ('reading_time', models.CharField(default=b'anytime', max_length=100, choices=[(b'anytime', b'Anytime'), (b'morning', b'Morning'), (b'midday', b'Midday'), (b'evening', b'Evening')])),
                ('content', models.TextField()),
                ('snippet', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('order', models.PositiveIntegerField()),
                ('article', models.ForeignKey(to='content.Article')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('img', models.ImageField(upload_to=b'images')),
                ('title', models.CharField(max_length=255, null=True, blank=True)),
                ('width', models.PositiveIntegerField(null=True, blank=True)),
                ('height', models.PositiveIntegerField(null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('authors', models.ManyToManyField(to='core.Person', null=True, through='content.Author', blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ImageAttachment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('caption', models.CharField(max_length=255, null=True, blank=True)),
                ('type', models.CharField(default=b'normal', max_length=255, null=True, choices=[(b'normal', b'Normal'), (b'file', b'File photo'), (b'courtesy', b'Courtesy photo')])),
                ('article', models.ForeignKey(blank=True, to='content.Article', null=True)),
                ('image', models.ForeignKey(related_name=b'image', on_delete=django.db.models.deletion.SET_NULL, to='content.Image', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=100)),
                ('slug', models.SlugField(unique=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=255)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255)),
                ('url', models.CharField(max_length=500)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='author',
            name='image',
            field=models.ForeignKey(to='content.Image'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='author',
            name='person',
            field=models.ForeignKey(to='core.Person'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='article',
            name='authors',
            field=models.ManyToManyField(to='core.Person', null=True, through='content.Author', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='article',
            name='featured_image',
            field=models.ForeignKey(related_name=b'featured_image', blank=True, to='content.ImageAttachment', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='article',
            name='images',
            field=models.ManyToManyField(related_name=b'images', null=True, through='content.ImageAttachment', to='content.Image', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='article',
            name='parent',
            field=models.ForeignKey(related_name=b'child', blank=True, to='content.Article', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='article',
            name='scripts',
            field=models.ManyToManyField(related_name=b'scripts', null=True, to='frontend.Script', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='article',
            name='section',
            field=models.ForeignKey(to='content.Section'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='article',
            name='snippets',
            field=models.ManyToManyField(related_name=b'snippets', null=True, to='frontend.Snippet', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='article',
            name='stylesheets',
            field=models.ManyToManyField(related_name=b'stylesheets', null=True, to='frontend.Stylesheet', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='article',
            name='tags',
            field=models.ManyToManyField(to='content.Tag', null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='article',
            name='topics',
            field=models.ManyToManyField(to='content.Topic', null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='article',
            name='videos',
            field=models.ManyToManyField(to='content.Video', null=True, blank=True),
            preserve_default=True,
        ),
    ]

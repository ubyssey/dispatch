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
                ('published_at', models.DateTimeField(null=True)),
                ('slug', models.SlugField()),
                ('shares', models.PositiveIntegerField(default=0, null=True, blank=True)),
                ('importance', models.PositiveIntegerField(default=3, choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)], validators=[django.core.validators.MaxValueValidator(5)])),
                ('status', models.PositiveIntegerField(default=0, choices=[(0, b'Draft'), (1, b'Published'), (2, b'Pitch'), (3, b'To be copyedited'), (4, b'To be managed')])),
                ('reading_time', models.CharField(default=b'anytime', max_length=100, choices=[(b'anytime', b'Anytime'), (b'morning', b'Morning'), (b'midday', b'Midday'), (b'evening', b'Evening')])),
                ('template', models.CharField(default=b'default', max_length=255)),
                ('content', models.TextField()),
                ('snippet', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('order', models.PositiveIntegerField()),
                ('article', models.ForeignKey(to='content.Article', null=True)),
            ],
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
                ('authors', models.ManyToManyField(to='core.Person', through='content.Author')),
            ],
        ),
        migrations.CreateModel(
            name='ImageAttachment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('caption', models.CharField(max_length=255, null=True, blank=True)),
                ('type', models.CharField(default=b'normal', max_length=255, null=True, choices=[(b'normal', b'Normal'), (b'file', b'File photo'), (b'courtesy', b'Courtesy photo')])),
                ('order', models.PositiveIntegerField(null=True)),
                ('article', models.ForeignKey(blank=True, to='content.Article', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ImageGallery',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255)),
                ('images', models.ManyToManyField(to='content.Image')),
            ],
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=100)),
                ('slug', models.SlugField(unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255)),
                ('url', models.CharField(max_length=500)),
            ],
        ),
        migrations.AddField(
            model_name='imageattachment',
            name='gallery',
            field=models.ForeignKey(blank=True, to='content.ImageGallery', null=True),
        ),
        migrations.AddField(
            model_name='imageattachment',
            name='image',
            field=models.ForeignKey(related_name='image', on_delete=django.db.models.deletion.SET_NULL, to='content.Image', null=True),
        ),
        migrations.AddField(
            model_name='author',
            name='image',
            field=models.ForeignKey(to='content.Image', null=True),
        ),
        migrations.AddField(
            model_name='author',
            name='person',
            field=models.ForeignKey(to='core.Person'),
        ),
        migrations.AddField(
            model_name='article',
            name='authors',
            field=models.ManyToManyField(to='core.Person', through='content.Author'),
        ),
        migrations.AddField(
            model_name='article',
            name='featured_image',
            field=models.ForeignKey(related_name='featured_image', blank=True, to='content.ImageAttachment', null=True),
        ),
        migrations.AddField(
            model_name='article',
            name='images',
            field=models.ManyToManyField(related_name='images', through='content.ImageAttachment', to='content.Image'),
        ),
        migrations.AddField(
            model_name='article',
            name='parent',
            field=models.ForeignKey(related_name='child', blank=True, to='content.Article', null=True),
        ),
        migrations.AddField(
            model_name='article',
            name='scripts',
            field=models.ManyToManyField(related_name='scripts', to='frontend.Script'),
        ),
        migrations.AddField(
            model_name='article',
            name='section',
            field=models.ForeignKey(to='content.Section'),
        ),
        migrations.AddField(
            model_name='article',
            name='snippets',
            field=models.ManyToManyField(related_name='snippets', to='frontend.Snippet'),
        ),
        migrations.AddField(
            model_name='article',
            name='stylesheets',
            field=models.ManyToManyField(related_name='stylesheets', to='frontend.Stylesheet'),
        ),
        migrations.AddField(
            model_name='article',
            name='tags',
            field=models.ManyToManyField(to='content.Tag'),
        ),
        migrations.AddField(
            model_name='article',
            name='topics',
            field=models.ManyToManyField(to='content.Topic'),
        ),
        migrations.AddField(
            model_name='article',
            name='videos',
            field=models.ManyToManyField(to='content.Video'),
        ),
    ]

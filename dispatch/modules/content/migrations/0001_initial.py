# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-05-18 20:11

from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import jsonfield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('revision_id', models.PositiveIntegerField(default=0)),
                ('head', models.BooleanField(default=False)),
                ('is_published', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('slug', models.SlugField(max_length=255)),
                ('shares', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('views', models.PositiveIntegerField(default=0)),
                ('template', models.CharField(default=b'default', max_length=255)),
                ('seo_keyword', models.CharField(max_length=100, null=True)),
                ('seo_description', models.TextField(null=True)),
                ('integrations', jsonfield.fields.JSONField(default={})),
                ('content', jsonfield.fields.JSONField(default=[])),
                ('snippet', models.TextField(null=True)),
                ('created_at', models.DateTimeField()),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('published_at', models.DateTimeField(null=True)),
                ('headline', models.CharField(max_length=255)),
                ('importance', models.PositiveIntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)], default=3, validators=[django.core.validators.MaxValueValidator(5)])),
                ('reading_time', models.CharField(choices=[(b'anytime', b'Anytime'), (b'morning', b'Morning'), (b'midday', b'Midday'), (b'evening', b'Evening')], default=b'anytime', max_length=100)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('file', models.FileField(upload_to=b'files/%Y/%m')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('img', models.ImageField(upload_to=b'images/%Y/%m')),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('width', models.PositiveIntegerField(blank=True, null=True)),
                ('height', models.PositiveIntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='ImageAttachment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('caption', models.TextField(blank=True, null=True)),
                ('credit', models.TextField(blank=True, null=True)),
                ('order', models.PositiveIntegerField(null=True)),
                ('article', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='article', to='content.Article')),
            ],
        ),
        migrations.CreateModel(
            name='ImageGallery',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('images', models.ManyToManyField(related_name='images', to='content.ImageAttachment')),
            ],
        ),
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('revision_id', models.PositiveIntegerField(default=0)),
                ('head', models.BooleanField(default=False)),
                ('is_published', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('slug', models.SlugField(max_length=255)),
                ('shares', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('views', models.PositiveIntegerField(default=0)),
                ('template', models.CharField(default=b'default', max_length=255)),
                ('seo_keyword', models.CharField(max_length=100, null=True)),
                ('seo_description', models.TextField(null=True)),
                ('integrations', jsonfield.fields.JSONField(default={})),
                ('content', jsonfield.fields.JSONField(default=[])),
                ('snippet', models.TextField(null=True)),
                ('created_at', models.DateTimeField()),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('published_at', models.DateTimeField(null=True)),
                ('title', models.CharField(max_length=255)),
                ('featured_image', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='page_featured_image', to='content.ImageAttachment')),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='page_parent', to='content.Page')),
                ('parent_page', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='parent_page_fk', to='content.Page')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('slug', models.SlugField(unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('last_used', models.DateTimeField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('url', models.CharField(max_length=500)),
            ],
        ),
        migrations.AddField(
            model_name='imageattachment',
            name='gallery',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='content.ImageGallery'),
        ),
        migrations.AddField(
            model_name='imageattachment',
            name='image',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='image', to='content.Image'),
        ),
        migrations.AddField(
            model_name='imageattachment',
            name='page',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='page', to='content.Page'),
        ),
    ]

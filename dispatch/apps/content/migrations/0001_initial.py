# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
from django.conf import settings
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0005_auto_20150914_0332'),
        ('frontend', '0002_auto_20150914_0407'),
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('preview', models.BooleanField(default=False)),
                ('revision_id', models.PositiveIntegerField(default=0)),
                ('head', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('slug', models.SlugField(max_length=255)),
                ('shares', models.PositiveIntegerField(default=0, null=True, blank=True)),
                ('views', models.PositiveIntegerField(default=0)),
                ('status', models.PositiveIntegerField(default=0, choices=[(0, b'Draft'), (1, b'Published'), (2, b'Pitch'), (3, b'To be copyedited'), (4, b'To be managed')])),
                ('published_at', models.DateTimeField(null=True)),
                ('template', models.CharField(default=b'default', max_length=255)),
                ('seo_keyword', models.CharField(max_length=100, null=True)),
                ('seo_description', models.TextField(null=True)),
                ('content', models.TextField()),
                ('snippet', models.TextField(null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('headline', models.CharField(max_length=255)),
                ('importance', models.PositiveIntegerField(default=3, choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)], validators=[django.core.validators.MaxValueValidator(5)])),
                ('est_reading_time', models.PositiveIntegerField(null=True)),
                ('reading_time', models.CharField(default=b'anytime', max_length=100, choices=[(b'anytime', b'Anytime'), (b'morning', b'Morning'), (b'midday', b'Midday'), (b'evening', b'Evening')])),
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
            name='Comment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('content', models.TextField()),
                ('votes', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('article', models.ForeignKey(to='content.Article')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('file', models.FileField(upload_to=b'files/%Y/%m')),
                ('tag', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('img', models.ImageField(upload_to=b'images/%Y/%m')),
                ('title', models.CharField(max_length=255, null=True, blank=True)),
                ('width', models.PositiveIntegerField(null=True, blank=True)),
                ('height', models.PositiveIntegerField(null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('authors', models.ManyToManyField(related_name='authors', through='content.Author', to='core.Person')),
            ],
        ),
        migrations.CreateModel(
            name='ImageAttachment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('caption', models.TextField(null=True, blank=True)),
                ('type', models.CharField(default=b'normal', max_length=255, null=True, choices=[(b'normal', b'Normal'), (b'file', b'File photo'), (b'courtesy', b'Courtesy photo')])),
                ('order', models.PositiveIntegerField(null=True)),
                ('article', models.ForeignKey(related_name='article', blank=True, to='content.Article', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ImageGallery',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('images', models.ManyToManyField(related_name='images', to='content.ImageAttachment')),
            ],
        ),
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('preview', models.BooleanField(default=False)),
                ('revision_id', models.PositiveIntegerField(default=0)),
                ('head', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('slug', models.SlugField(max_length=255)),
                ('shares', models.PositiveIntegerField(default=0, null=True, blank=True)),
                ('views', models.PositiveIntegerField(default=0)),
                ('status', models.PositiveIntegerField(default=0, choices=[(0, b'Draft'), (1, b'Published'), (2, b'Pitch'), (3, b'To be copyedited'), (4, b'To be managed')])),
                ('template', models.CharField(default=b'default', max_length=255)),
                ('seo_keyword', models.CharField(max_length=100, null=True)),
                ('seo_description', models.TextField(null=True)),
                ('content', models.TextField()),
                ('snippet', models.TextField(null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=255)),
                ('featured_image', models.ForeignKey(related_name='page_featured_image', blank=True, to='content.ImageAttachment', null=True)),
                ('images', models.ManyToManyField(related_name='page_images', through='content.ImageAttachment', to='content.Image')),
                ('parent', models.ForeignKey(related_name='page_parent', blank=True, to='content.Article', null=True)),
                ('parent_page', models.ForeignKey(related_name='parent_page_fk', to='content.Page')),
                ('scripts', models.ManyToManyField(related_name='page_scripts', to='frontend.Script')),
                ('snippets', models.ManyToManyField(related_name='page_snippets', to='frontend.Snippet')),
                ('stylesheets', models.ManyToManyField(related_name='page_stylesheets', to='frontend.Stylesheet')),
            ],
            options={
                'abstract': False,
            },
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
                ('last_used', models.DateTimeField(null=True)),
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
            model_name='page',
            name='videos',
            field=models.ManyToManyField(related_name='page_videos', to='content.Video'),
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
            model_name='imageattachment',
            name='page',
            field=models.ForeignKey(related_name='page', blank=True, to='content.Page', null=True),
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
            field=models.ForeignKey(related_name='article_featured_image', blank=True, to='content.ImageAttachment', null=True),
        ),
        migrations.AddField(
            model_name='article',
            name='images',
            field=models.ManyToManyField(related_name='article_images', through='content.ImageAttachment', to='content.Image'),
        ),
        migrations.AddField(
            model_name='article',
            name='parent',
            field=models.ForeignKey(related_name='article_parent', blank=True, to='content.Article', null=True),
        ),
        migrations.AddField(
            model_name='article',
            name='scripts',
            field=models.ManyToManyField(related_name='article_scripts', to='frontend.Script'),
        ),
        migrations.AddField(
            model_name='article',
            name='section',
            field=models.ForeignKey(to='content.Section'),
        ),
        migrations.AddField(
            model_name='article',
            name='snippets',
            field=models.ManyToManyField(related_name='article_snippets', to='frontend.Snippet'),
        ),
        migrations.AddField(
            model_name='article',
            name='stylesheets',
            field=models.ManyToManyField(related_name='article_stylesheets', to='frontend.Stylesheet'),
        ),
        migrations.AddField(
            model_name='article',
            name='tags',
            field=models.ManyToManyField(to='content.Tag'),
        ),
        migrations.AddField(
            model_name='article',
            name='topic',
            field=models.ForeignKey(to='content.Topic', null=True),
        ),
        migrations.AddField(
            model_name='article',
            name='videos',
            field=models.ManyToManyField(related_name='article_videos', to='content.Video'),
        ),
    ]

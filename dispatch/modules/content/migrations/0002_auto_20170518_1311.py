# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-05-18 20:11
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('content', '0001_initial'),
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='authors',
            field=models.ManyToManyField(related_name='authors', through='content.Author', to='core.Person'),
        ),
        migrations.AddField(
            model_name='author',
            name='article',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='content.Article'),
        ),
        migrations.AddField(
            model_name='author',
            name='image',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='content.Image'),
        ),
        migrations.AddField(
            model_name='author',
            name='person',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Person'),
        ),
        migrations.AddField(
            model_name='article',
            name='authors',
            field=models.ManyToManyField(through='content.Author', to='core.Person'),
        ),
        migrations.AddField(
            model_name='article',
            name='featured_image',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='article_featured_image', to='content.ImageAttachment'),
        ),
        migrations.AddField(
            model_name='article',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='article_parent', to='content.Article'),
        ),
        migrations.AddField(
            model_name='article',
            name='section',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='content.Section'),
        ),
        migrations.AddField(
            model_name='article',
            name='tags',
            field=models.ManyToManyField(to='content.Tag'),
        ),
        migrations.AddField(
            model_name='article',
            name='topic',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='content.Topic'),
        ),
    ]

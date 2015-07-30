# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0005_topic_last_used'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email', models.CharField(max_length=255)),
                ('content', models.TextField()),
                ('num_ratings', models.PositiveIntegerField(default=0)),
                ('total_rating', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('article', models.ForeignKey(to='content.Article')),
            ],
        ),
        migrations.AddField(
            model_name='article',
            name='comments',
            field=models.ManyToManyField(related_name='comments', to='content.Comment'),
        ),
    ]

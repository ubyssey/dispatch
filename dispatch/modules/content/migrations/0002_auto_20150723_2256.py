# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageGallery',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255)),
                ('images', models.ManyToManyField(to='content.Image')),
            ],
        ),
        migrations.RemoveField(
            model_name='article',
            name='is_published',
        ),
        migrations.AlterField(
            model_name='article',
            name='status',
            field=models.PositiveIntegerField(default=0, choices=[(0, b'Draft'), (1, b'Published'), (2, b'Pitch'), (3, b'To be copyedited'), (4, b'To be managed')]),
        ),
    ]

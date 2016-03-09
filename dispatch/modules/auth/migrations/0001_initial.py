# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(null=True, verbose_name='last login', blank=True)),
                ('email', models.CharField(unique=True, max_length=255)),
                ('is_admin', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('groups', models.ManyToManyField(related_query_name=b'user', related_name='user_set', to='auth.Group', blank=True, help_text=b'The groups this user belongs to. A user will get all permissions granted to each of their groups.', verbose_name=b'groups')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('full_name', models.CharField(max_length=255, null=True, blank=True)),
                ('is_admin', models.BooleanField(default=True)),
                ('image', models.ImageField(null=True, upload_to=b'images')),
            ],
        ),
        migrations.CreateModel(
            name='Setting',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('value', models.CharField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='person',
            field=models.OneToOneField(related_name='person', null=True, blank=True, to='core.Person'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(related_query_name=b'user', related_name='user_set', to='auth.Permission', blank=True, help_text=b'Specific permissions for this user.', verbose_name=b'user permissions'),
        ),
    ]

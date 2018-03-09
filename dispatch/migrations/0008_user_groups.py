from __future__ import unicode_literals

from django.contrib.auth.models import User, Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.db import migrations, models

def add_groups(apps, schema_editor):

    group, created = Group.objects.get_or_create(name='Admin')
    if not created:
        permission = Permission.objects.get(codename='add_user' ,name='Can add user')
        print(permission)
        print('group is: ', group)
        group.permissions.add(permission)
        print('group permissions: ', group.permissions.all())

def remove_groups(apps, schema_editor):
    return

class Migration(migrations.Migration):
    dependencies = [
        ('dispatch', '0007_author_many_to_many'),
    ]

    operations = [
    	migrations.RunPython(add_groups, remove_groups),
    ]

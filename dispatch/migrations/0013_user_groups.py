from django.contrib.auth.models import Group, Permission
from dispatch.models import User, Invite
from django.contrib.contenttypes.models import ContentType
from django.db import migrations, models

def add_groups(apps, schema_editor):

    group, created = Group.objects.get_or_create(name='Admin')
    content_type = ContentType.objects.get_for_model(User)

    permission, created = Permission.objects.get_or_create(codename='add_user', name='Can add user', content_type=content_type)
    group.permissions.add(permission)

    permission, created = Permission.objects.get_or_create(codename='change_user', name='Can change user', content_type=content_type)
    group.permissions.add(permission)

    permission, created = Permission.objects.get_or_create(codename='delete_user', name='Can delete user', content_type=content_type)
    group.permissions.add(permission)

    content_type = ContentType.objects.get_for_model(Invite)

    permission, created = Permission.objects.get_or_create(codename='add_invite', name='Can add invite', content_type=content_type)
    group.permissions.add(permission)

    permission, created = Permission.objects.get_or_create(codename='change_invite', name='Can change invite', content_type=content_type)
    group.permissions.add(permission)

    permission, created = Permission.objects.get_or_create(codename='delete_invite', name='Can delete invite', content_type=content_type)
    group.permissions.add(permission)

def remove_groups(apps, schema_editor):
    group = Group.objects.get(name='Admin')
    group.delete()
    return

class Migration(migrations.Migration):
    dependencies = [
        ('dispatch', '0012_polls'),
    ]

    operations = [
    	migrations.RunPython(add_groups, remove_groups),
    ]

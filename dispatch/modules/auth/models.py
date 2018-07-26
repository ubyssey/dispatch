import uuid

from django.db.models import (
    Model, CharField, SlugField, TextField,
    BooleanField, OneToOneField, ImageField, PROTECT, CASCADE, ManyToManyField, DateTimeField, UUIDField)
from django.conf import settings

from django.contrib.auth.models import AbstractBaseUser, Group, Permission, PermissionsMixin

from dispatch.modules.auth.managers import UserManager
from dispatch.modules.auth.helpers import get_expiration_date

class Person(Model):
    full_name = CharField(max_length=255, blank=True, null=True)
    is_admin = BooleanField(default=True)

    image = ImageField(upload_to='images', null=True)
    slug = SlugField(null=True, unique=True)
    description = TextField(null=True, blank=True)
    title = CharField(max_length=255, null=True, blank=True)
    facebook_url = CharField(max_length=255, null=True)
    twitter_url = CharField(max_length=255, null=True)

    def get_image_url(self):
        return settings.MEDIA_URL + str(self.image)

    def get_absolute_image_url(self):
        """
        Returns image URL.
        """
        if self.image:
            return settings.MEDIA_URL + str(self.image)
            
    def __str__(self):
        return self.full_name or ''

class User(AbstractBaseUser, PermissionsMixin):
    email = CharField(max_length=255, unique=True)
    is_active = BooleanField(default=True)
    person = OneToOneField(Person, null=True, related_name='person', on_delete=PROTECT)

    groups = ManyToManyField(Group)

    USERNAME_FIELD = 'email'

    objects = UserManager(Person)

    def get_permissions(self):
        """Returns the user's permissions."""

        permissions = ''
        if self.groups.filter(name='Admin').exists() or self.is_superuser:
            permissions = 'admin'

        return permissions

    def modify_permissions(self, permissions):
        """Modify the user's permissions."""

        group = Group.objects.get(name='Admin')

        if permissions == 'admin':
            self.groups.add(group)
        else:
            self.groups.remove(group)

class Invite(Model):
    id = UUIDField(default=uuid.uuid4, primary_key=True)
    email = CharField(max_length=255, unique=True)
    person = OneToOneField(Person, null=False, related_name='invited_person', on_delete=CASCADE)
    permissions = CharField(max_length=255, default='')
    expiration_date = DateTimeField(default=get_expiration_date)

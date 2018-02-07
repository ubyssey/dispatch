from django.db.models import (
    Model, CharField, SlugField, TextField,
    BooleanField, OneToOneField, ImageField, PROTECT, ManyToManyField)
from django.conf import settings

from django.contrib.auth.models import AbstractBaseUser, Group, Permission, PermissionsMixin

from dispatch.modules.auth.managers import UserManager

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

    def __str__(self):
        return self.full_name or ''

class User(AbstractBaseUser, PermissionsMixin):
    email = CharField(max_length=255, unique=True)
    is_active = BooleanField(default=True)
    person = OneToOneField(Person, null=True, related_name='person', on_delete=PROTECT)

    groups = ManyToManyField(Group)

    USERNAME_FIELD = 'email'

    objects = UserManager(Person)

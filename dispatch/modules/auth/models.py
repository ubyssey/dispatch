from django.db.models import (
    Model, CharField, SlugField, TextField,
    BooleanField, OneToOneField, ImageField, PROTECT)
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

    def get_absolute_image_url(self):
        """
        Returns image URL.
        """
        if self.image:
            return "%s%s%s/" % (settings.BASE_URL.strip("/"), settings.MEDIA_URL, str(self.image))

    def __str__(self):
        return self.full_name or ''

class User(AbstractBaseUser, PermissionsMixin):
    email = CharField(max_length=255, unique=True)
    is_staff = BooleanField(default=False)
    is_active = BooleanField(default=True)
    person = OneToOneField(Person, null=True, related_name='person', on_delete=PROTECT)

    USERNAME_FIELD = 'email'

    objects = UserManager(Person)

    def gen_short_name(self):
        if self.person:
            return self.person.__str__()
        else:
            return self.email

    def get_short_name(self):
        return self.gen_short_name()

    def has_perm(self, perm, obj=None):
        return self.is_staff

    def has_module_perms(self, app_label):
        return self.is_staff

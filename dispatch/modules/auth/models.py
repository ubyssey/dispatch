from django.db.models import Model, CharField, SlugField, TextField, BooleanField, ForeignKey, OneToOneField, ManyToManyField, ImageField, DateTimeField, PositiveIntegerField
from django.conf import settings

from django.contrib.auth.models import AbstractBaseUser, Group, Permission, PermissionsMixin

from dispatch.apps.core.managers import UserManager, IntegrationManager

class Person(Model):
    full_name = CharField(max_length=255, blank=True, null=True)
    is_admin = BooleanField(default=True)

    image = ImageField(upload_to='images', null=True, blank=True)
    slug = SlugField(null=True, blank=True, unique=True)
    description = TextField(null=True, blank=True)

    def get_image_url(self):
        return settings.MEDIA_URL + str(self.image)

    def __str__(self):
        return self.full_name or ''

class User(AbstractBaseUser, PermissionsMixin):
    email = CharField(max_length=255, unique=True)
    is_staff = BooleanField(default=False)
    is_active = BooleanField(default=True)
    person = OneToOneField(Person, blank=True, null=True, related_name='person')

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

class Setting(Model):
    name = CharField(max_length=255)
    value = CharField(max_length=255)

class Action(Model):
    user = ForeignKey(User)
    action = CharField(max_length=50)
    object_type = CharField(max_length=50)
    object_id = PositiveIntegerField()
    timestamp = DateTimeField(auto_now=True)

class Integration(Model):
    """
    Stores information about a Dispatch integration setting.
    """

    integration_id = CharField(unique=True, max_length=100)
    settings = TextField(default='{}')

    objects = IntegrationManager()

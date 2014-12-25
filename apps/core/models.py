from django.db.models import Model, CharField, BooleanField, ForeignKey, OneToOneField, ManyToManyField
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission

class UserManager(BaseUserManager):

    def _create_user(self, email, password=None, is_admin=False, is_active=True, is_superuser=False):
        if not email:
            raise ValueError('User must have a valid email address')

        if not self.is_valid_password(password):
            raise ValueError('Password is invalid')

        user = User(email=email,is_admin=is_admin, is_active=is_active, is_superuser=is_superuser)
        user.set_password(password)
        user.save()

        return user

    def create_user(self, email, password=None):
        return self._create_user(email, password)

    def create_superuser(self, email, password):
        return self._create_user(email, password, True, True, True)

    def is_valid_password(self, password):
        return len(password) >= 8

class ContributorRole(Model):
    title = CharField(max_length=255)

    def __str__(self):
        return u'%s' % (self.title)

class Person(Model):
    first_name = CharField(max_length=255)
    last_name = CharField(max_length=255)
    user = ForeignKey('User', blank=True, null=True, related_name='user')
    roles = ManyToManyField(ContributorRole, blank=True, null=True)

    def full_name(self):
        return self.__str__()

    def __str__(self):
        return u'%s %s' % (self.first_name, self.last_name)


class User(AbstractBaseUser):
    email = CharField(max_length=255, unique=True)
    is_admin = BooleanField(default=False)
    is_active = BooleanField(default=True)
    is_superuser = BooleanField()
    person = OneToOneField(Person, blank=True, null=True, related_name='person')
    groups = ManyToManyField(Group, verbose_name=('groups'),
        blank=True, help_text=('The groups this user belongs to. A user will '
                                'get all permissions granted to each of '
                                'their groups.'),
        related_name="user_set", related_query_name="user")
    user_permissions = ManyToManyField(Permission,
        verbose_name=('user permissions'), blank=True,
        help_text=('Specific permissions for this user.'),
        related_name="user_set", related_query_name="user")

    USERNAME_FIELD = 'email'

    objects = UserManager()

    def gen_short_name(self):
        if self.person:
            return self.person.__str__()
        else:
            return self.email

    def get_short_name(self):
        return self.gen_short_name()

    def __str__(self):
        return self.gen_short_name()

    @property
    def is_superuser(self):
        return self.is_superuser

    @property
    def is_staff(self):
        return self.is_admin

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

class Setting(Model):
    name = CharField(max_length=255)
    value = CharField(max_length=255)

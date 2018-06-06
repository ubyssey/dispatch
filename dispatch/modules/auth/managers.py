from django.contrib.auth.models import BaseUserManager, Group
from django.contrib.auth.models import Permission

class UserManager(BaseUserManager):

    def __init__(self, personModel):
        super(BaseUserManager, self).__init__()

        self.personModel = personModel

    def _create_user(self, email, password=None, permissions=None, is_active=True, is_superuser=False):
        if not email:
            raise ValueError('User must have a valid email address')

        if not self.is_valid_password(password):
            raise ValueError('Password is invalid')

        user = self.model(email=email, is_active=is_active, is_superuser=is_superuser)
        user.set_password(password)

        person = self.personModel.objects.create()
        user.person = person

        user.save()

        if permissions == 'admin':
            group = Group.objects.get(name='Admin')
            user.groups.add(group)

        return user

    def create_user(self, email, password=None, permissions=None):
        return self._create_user(email, password, permissions, True, False)

    def create_superuser(self, email, password):
        return self._create_user(email, password, 'admin', True, True)

    def is_valid_password(self, password):
        return len(password) >= 8

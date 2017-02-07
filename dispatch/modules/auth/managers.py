from django.db.models import Manager
from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):

    def _create_user(self, email, password=None, is_admin=False, is_active=True, is_superuser=False):
        if not email:
            raise ValueError('User must have a valid email address')

        if not self.is_valid_password(password):
            raise ValueError('Password is invalid')

        user = User(email=email, is_admin=is_admin, is_active=is_active, is_superuser=is_superuser)
        user.set_password(password)

        person = Person.objects.create()
        user.person = person

        user.save()

        return user

    def create_user(self, email, password=None):
        return self._create_user(email, password)

    def create_superuser(self, email, password):
        return self._create_user(email, password, True, True, True)

    def is_valid_password(self, password):
        return len(password) >= 8

class IntegrationSettingManager(Manager):

    def get_for_integration(self, integration_id, show_hidden=False):
        """Return settings for given integration as a dictionary."""

        integrations = self.filter(integration_id=integration_id)

        if not show_hidden:
            integrations = integrations.exclude(is_hidden=True)

        return { i.key: i.value for i in integrations }

    def update_for_integration(self, integration_id, key, value, is_hidden=False):
        """Updates setting for this integration with the given name."""

        setting = self.create(
            integration_id=integration_id,
            key=key,
            value=value,
            is_hidden=is_hidden
        )

        setting.save()

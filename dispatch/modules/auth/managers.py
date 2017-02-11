import json

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

class IntegrationManager(Manager):

    def get_settings(self, integration_id):
        """Return settings for given integration as a dictionary."""

        try:
            integration = self.get(integration_id=integration_id)
            return json.loads(integration.settings)
        except (self.model.DoesNotExist, ValueError):
            return {}

    def update_settings(self, integration_id, settings):
        """Updates settings for given integration."""

        (integration, created) = self.get_or_create(integration_id=integration_id)

        try:
            current_settings = json.loads(integration.settings)
        except ValueError:
            current_settings = {}

        current_settings.update(settings)

        integration.settings = json.dumps(current_settings)

        integration.save()


    def delete_integration(self, integration_id):
        """Deletes all settings for given integration."""

        return self.filter(integration_id=integration_id).delete()

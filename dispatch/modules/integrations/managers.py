import json

from django.db.models import Manager

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

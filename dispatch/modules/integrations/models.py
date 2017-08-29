from django.db.models import Model, CharField, TextField

from dispatch.modules.integrations.managers import IntegrationManager

class Integration(Model):
    """
    Stores information about a Dispatch integration setting.
    """

    integration_id = CharField(unique=True, max_length=100)
    settings = TextField(default='{}')

    objects = IntegrationManager()

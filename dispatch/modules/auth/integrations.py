import requests

from dispatch.apps.core.models import Integration

class IntegrationNotFound(Exception):
    pass

class IntegrationLibrary(object):

    def __init__(self):
        self.library = {}

    def register(self, integration):
        self.library[integration.ID] = integration

    def get(self, id):
        if id in self.library:
            return self.library[id]
        else:
            raise IntegrationNotFound()

    def list(self):
        return self.library.values()

integrationLib = IntegrationLibrary()

class BaseIntegration(object):
    """Base class for all integrations."""

    HIDDEN_FIELDS = []

    @classmethod
    def get_settings(cls, show_hidden=False):
        """
        Retrieves the settings for this integration as a dictionary.

        Removes all hidden fields if show_hidden=False
        """
        settings = Integration.objects.get_settings(cls.ID)

        if not show_hidden:
            for field in cls.HIDDEN_FIELDS:
                settings.pop(field, None)

        return settings

    @classmethod
    def update_settings(cls, settings):
        """Updates setting for this integration with the given name."""
        return Integration.objects.update_settings(cls.ID, settings)

    @classmethod
    def delete(cls):
        return Integration.objects.delete_integration(cls.ID)

class FacebookInstantArticlesIntegration(BaseIntegration):
    """Facebook Instant Articles integration."""

    ID = 'fb-instant-articles'
    API_ROOT = 'https://graph.facebook.com/v2.8/'
    REDIRECT_URI = 'http://localhost:8000/admin/integrations/%s/?callback=1' % ID

    HIDDEN_FIELDS = [
        'client_secret',
    ]

    @classmethod
    def save(cls, settings):

        # Save client settings
        if 'client_id' in settings and 'client_secret' in settings:
            settings['client_configured'] = True

        # Save page settings
        if 'page_id' in settings and 'page_access_token' in settings and 'page_name' in settings:
            settings['page_configured'] = True

        cls.update_settings(settings)

    @classmethod
    def callback(cls, user, query):
        """Receive OAuth callback request from Facebook."""

        # TODO: Add error handling for Facebook API errors

        # Get settings for this integration
        settings = cls.get_settings(show_hidden=True)

        payload = {
            'client_id': settings['client_id'],
            'client_secret': settings['client_secret'],
            'code': query['code'],
            'redirect_uri': cls.REDIRECT_URI
        }

        # TODO: Use https://facebook-sdk.readthedocs.io/ instead of requests

        r = requests.get(cls.API_ROOT + 'oauth/access_token', params=payload)

        data = r.json()

        access_token = data['access_token']

        payload = {
            'access_token': access_token
        }

        r = requests.get(cls.API_ROOT + 'me/accounts', params=payload)

        pages = r.json()

        return {
            'pages': pages
        }

# Register integrations
integrationLib.register(FacebookInstantArticlesIntegration)

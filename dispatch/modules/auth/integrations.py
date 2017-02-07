import requests

from dispatch.apps.core.models import IntegrationSetting

class BaseIntegration(object):
    """Base class for all integrations."""

    @classmethod
    def get_settings(cls, show_hidden=False):
        """Retrieves the settings for this integration as a dictionary."""
        return IntegrationSetting.objects.get_for_integration(cls.ID, show_hidden)

    @classmethod
    def update_setting(cls, key, value, is_hidden=False):
        """Updates setting for this integration with the given name."""
        return IntegrationSetting.objects.update_for_integration(cls.ID, key, value, is_hidden)

class FacebookInstantArticlesIntegration(BaseIntegration):
    """Facebook Instant Articles integration."""

    ID = 'fb-instant-articles'
    API_ROOT = 'https://www.facebook.com/v2.8/'

    @staticmethod
    def callback(user, query):

        payload = {
            'grant_type': 'fb_exchange_token',
            'client_id': '',
            'client_secret': ''
        }

        r = requests.get(API_ROOT + 'oauth/access_token')

        print r.text

        return 'test code'

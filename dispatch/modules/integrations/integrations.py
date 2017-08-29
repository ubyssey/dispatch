import json

from django.db.models import signals
from django.template import loader, Context
from django.utils.html import escape

from dispatch.core.signals import post_create, post_update
from dispatch.modules.content.models import Article
from dispatch.modules.integrations.models import Integration

from dispatch.vendor.apis import Facebook, FacebookAPIError

class IntegrationNotFound(Exception):
    pass

class IntegrationCallbackError(Exception):
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

        # Get settings for this integration
        settings = cls.get_settings(show_hidden=True)

        fb = Facebook()

        payload = {
            'client_id': settings['client_id'],
            'client_secret': settings['client_secret'],
            'code': query['code'],
            'redirect_uri': cls.REDIRECT_URI
        }

        try:

            # Authenticate with Facebook
            fb.get_access_token(payload)

            # Fetch pages belonging to authenticated user
            pages = fb.list_pages('me')

        except FacebookAPIError, e:
            raise IntegrationCallbackError(e.message)

        return {
            'pages': pages
        }


    @classmethod
    def render_article_content(cls, article):

        # TODO: convert amp to &amp;

        contentHTML = ''

        blocks = json.loads(article.content)

        for block in blocks:
            if block['type'] == 'paragraph':
                newString = escape(block['data'])
                contentHTML += "<p>%s</p>\n" % newString

        return contentHTML

    @classmethod
    def render_article(cls, article):

        template = loader.get_template('instant_article.html')

        context = Context({
            'article': article,
            'content': cls.render_article_content(article)
        })

        return template.render(context)

    @classmethod
    def update_instant_article(cls, sender, instance, **kwargs):

        integration = instance.integrations.get('fb-instant-articles', {})

        if integration.get('enabled'):

            html = cls.render_article(instance)

            settings = cls.get_settings()

            if settings['page_configured']:
                page_id = settings['page_id']
                page_access_token = settings['page_access_token']

                fb = Facebook(access_token=page_access_token)

                print fb.create_instant_article(page_id, html, False, True)


# Register integrations
integrationLib.register(FacebookInstantArticlesIntegration)

# Connect signals
post_create.connect(FacebookInstantArticlesIntegration.update_instant_article, sender=Article)
post_update.connect(FacebookInstantArticlesIntegration.update_instant_article, sender=Article)

from django.core.wsgi import get_wsgi_application as dj_get_wsgi_application

from dispatch.core.management import configure_settings

def get_wsgi_application():
    configure_settings()
    return dj_get_wsgi_application()

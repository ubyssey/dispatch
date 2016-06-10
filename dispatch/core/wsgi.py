from django.core.wsgi import get_wsgi_application as dj_get_wsgi_application

from dispatch.conf import settings

def get_wsgi_application():
    settings.configure()
    
    return dj_get_wsgi_application()

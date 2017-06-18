import os

from dispatch.conf.default_settings import (
    ROOT_URLCONF,
    REST_FRAMEWORK,
    AUTH_USER_MODEL,
    INSTALLED_APPS as DEFAULT_INSTALLED_APPS,
    DISPATCH_PROJECT_MODULE,
    TEMPLATES,
    AUTH_PASSWORD_VALIDATORS
)

SECRET_KEY = 'fake-key'
BASE_URL = 'http://test.dispatch/'

FACEBOOK_CLIENT_ID = ''
FACEBOOK_CLIENT_SECRET = ''

INSTALLED_APPS = ['dispatch.tests'] + DEFAULT_INSTALLED_APPS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'test_dispatch',
    }
}

MEDIA_ROOT = os.path.join(os.path.dirname(__file__), 'media')

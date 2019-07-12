import os

from dispatch.default_settings import *

BASE_DIR = os.path.dirname(__file__)

ROOT_URLCONF = 'dispatch.tests.urls'

DEBUG = False
SECRET_KEY = 'fake-key'
BASE_URL = 'http://test.dispatch/'

FACEBOOK_CLIENT_ID = ''
FACEBOOK_CLIENT_SECRET = ''

INSTALLED_APPS += ['dispatch.tests']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'test_dispatch',
    }
}

TEMPLATES += [
    {
        'NAME': 'test',
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
        ],
    }
]

STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

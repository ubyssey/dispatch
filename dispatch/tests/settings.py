import os

from dispatch.default_settings import *

BASE_DIR = os.path.dirname(__file__)

ROOT_URLCONF = 'dispatch.tests.urls'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'NOTSET',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        }
    },
    'loggers': {
        '': {
            'handlers': ['console'],
            'level': 'NOTSET',
        },
        'django.request': {
            'handlers': ['console'],
            'propagate': False,
            'level': 'ERROR'
        }
    }
}

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

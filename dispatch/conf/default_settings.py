"""
Default Dispatch settings
"""

import os
import sys

from django.conf.global_settings import *

DISPATCH_PROJECT_MODULE = os.environ.get('DISPATCH_PROJECT_MODULE', '')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
BASE_PROJECT_DIR = os.environ.get('DISPATCH_PROJECT_DIR', BASE_DIR)

BASE_URL = 'http://localhost:8000/'

sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

# Application definition
INSTALLED_APPS = [
    'dispatch.apps.content',
    'dispatch.apps.core',
    'dispatch.apps.frontend',
    'dispatch.apps.events',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'rest_framework',
    'rest_framework.authtoken',
    'phonenumber_field'
]

# Logging
LOGGING = {
    'version': 1,
    'handlers': {
        'console':{
            'level':'DEBUG',
            'class':'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.request': {
            'handlers':['console'],
            'propagate': True,
            'level':'DEBUG',
        }
    },
}

# Replace default user model
AUTH_USER_MODEL = 'core.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 9,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_PROJECT_DIR, DISPATCH_PROJECT_MODULE, 'templates'),
            os.path.join(BASE_DIR, 'dispatch/templates'),
            os.path.join(BASE_DIR, 'dispatch/apps/frontend/themes/default/templates')
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.core.context_processors.i18n',
                'django.core.context_processors.media',
                'django.core.context_processors.static',
                'django.core.context_processors.tz',
                'django.contrib.messages.context_processors.messages'
            ]
        }
    }
]

# REST framework settings
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'UNICODE_JSON': True,
    'PAGE_SIZE': 10
}

MIDDLEWARE_CLASSES = [
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware'
]

ROOT_URLCONF = 'dispatch.urls'
APPEND_SLASH = True
WSGI_APPLICATION = '%s.wsgi.application' % DISPATCH_PROJECT_MODULE

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static and media files
STATIC_ROOT = os.path.join(BASE_PROJECT_DIR, 'static')
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'dispatch/static/dist'),
    os.path.join(BASE_DIR, 'dispatch/static/manager/dist')
)

MEDIA_ROOT = os.path.join(BASE_PROJECT_DIR, 'media')
MEDIA_URL = '/media/'

PHONENUMBER_DB_FORMAT = 'NATIONAL'
PHONENUMBER_DEFAULT_REGION = 'CA'

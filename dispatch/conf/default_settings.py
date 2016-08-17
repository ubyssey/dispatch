"""
Default Dispatch settings
"""

import os
import sys

from django.conf.global_settings import *

DISPATCH_PROJECT_MODULE = os.environ.get('DISPATCH_PROJECT_MODULE')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
BASE_PROJECT_DIR = os.environ.get('DISPATCH_PROJECT_DIR', BASE_DIR)

BASE_URL = 'http://localhost:8000/'

sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

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

TEMPLATE_DEBUG = False

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Replace default user model
AUTH_USER_MODEL = 'core.User'

TEMPLATE_DIRS = [
    os.path.join(BASE_PROJECT_DIR, DISPATCH_PROJECT_MODULE, 'templates'),
    os.path.join(BASE_DIR, 'dispatch/templates'),
    os.path.join(BASE_DIR, 'dispatch/apps/frontend/themes/default/templates')
    ]

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticatedOrReadOnly',),
    'UNICODE_JSON': True,
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 10
}

LOGIN_REDIRECT_URL = 'dispatch.apps.manager.views.home'

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'rest_framework',
    'dispatch.apps.content',
    'dispatch.apps.core',
    'dispatch.apps.frontend',
    'dispatch.apps.manager',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

)

ROOT_URLCONF = 'dispatch.urls'
APPEND_SLASH = True
WSGI_APPLICATION = '%s.wsgi.application' % DISPATCH_PROJECT_MODULE

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.core.context_processors.tz",
    "django.contrib.messages.context_processors.messages",
    "dispatch.helpers.context_processors.static"
)

STATIC_ROOT = os.path.join(BASE_PROJECT_DIR, 'static')
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'dispatch/static/dist'),
)

MEDIA_ROOT = os.path.join(BASE_PROJECT_DIR, 'media')
MEDIA_URL = '/media/'

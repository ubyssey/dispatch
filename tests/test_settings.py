SECRET_KEY = 'fake-key'

INSTALLED_APPS = [
    'tests',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'rest_framework',
    'rest_framework.authtoken',
    'dispatch',
    'dispatch.apps.api',
    'dispatch.apps.content',
    'dispatch.apps.core',
    'dispatch.apps.frontend'
]

BASE_URL = 'http://test.dispatch/'

ROOT_URLCONF = 'dispatch.urls'
DISPATCH_PROJECT_MODULE = None

AUTH_USER_MODEL = 'core.User'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'test_dispatch',
    }
}

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

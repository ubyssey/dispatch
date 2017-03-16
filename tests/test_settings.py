SECRET_KEY = 'fake-key'

INSTALLED_APPS = [
    'tests',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'dispatch.apps.content',
    'dispatch.apps.core',
    'dispatch.apps.frontend',
    'dispatch.apps.manager',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'test_dispatch',
    }
}

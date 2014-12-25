from dispatch.helpers import ThemeHelper

SERVER = 'http://dispatch.dev:8888/'

def static(request):
    return {
        'STATIC_DIR': SERVER+ThemeHelper.get_static_dir(),
        'MEDIA_DIR': SERVER+'media/'
    }
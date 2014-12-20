from dispatch.helpers import ThemeHelper

def static(request):
    return {'STATIC_DIR': 'http://dispatch.dev:8888/'+ThemeHelper.get_static_dir() }
import os
from django.conf import settings
from dispatch.helpers import ThemeHelper

def static(request):
    return {
        'STATIC_DIR': os.path.join(settings.BASE_STATIC_URL, ThemeHelper.get_static_dir()),
        'MEDIA_DIR': os.path.join(settings.BASE_STATIC_URL, 'media/'),
    }
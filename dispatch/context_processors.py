import os
from django.conf import settings
from dispatch.helpers import ThemeHelper

def static(request):
    return {
        'STATIC_DIR': os.path.join(settings.BASE_URL, settings.STATIC_URL),
        'MEDIA_DIR': os.path.join(settings.BASE_URL, settings.MEDIA_URL),
    }
import os
from django.conf import settings
from dispatch.helpers import ThemeHelper

def static(request):
    return {
        'version': settings.VERSION,
    }
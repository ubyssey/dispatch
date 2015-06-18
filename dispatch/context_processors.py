import os
from django.conf import settings
from dispatch.helpers import ThemeHelper
from dispatch import __version__

def static(request):
    return {
        'version': __version__,
    }
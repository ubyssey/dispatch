from django.conf.urls import url
from django.conf import settings
from django.shortcuts import render_to_response

import dispatch

def admin(request):
    """Render HTML entry point for manager app."""
    context = {
        'api_url': settings.API_URL,
        'app_bundle': 'js/index-%s.js' % dispatch.__version__
    }
    return render_to_response('manager/index.html', context)

urlpatterns = [url(r'/?.*/', admin, name='dispatch-admin')]

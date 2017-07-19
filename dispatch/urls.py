from django.conf.urls import include, url
from django.shortcuts import render_to_response

from rest_framework import routers

from dispatch.helpers.theme import ThemeHelper
from dispatch.apps.api.urls import urlpatterns as api_urls
from dispatch.apps.events.urls import urlpatterns as events_urls

def admin(request):
    """Render HTML entry point for manager app."""
    return render_to_response('manager/index.html', {})

urlpatterns = [
    url(r'^admin/?.*/', admin),
    url(r'^api/', include(api_urls)),
    url(r'^events/', include(events_urls)),
    url(r'^', include(ThemeHelper.get_theme_urls())),
]

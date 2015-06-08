from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static

from rest_framework import routers

from dispatch.apps.api.urls import urlpatterns as api_patterns
from dispatch.helpers import ThemeHelper
from dispatch.apps.content import views as content_views
from dispatch.apps.manager import urls as adminurls

static_patterns = static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
media_patterns = static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = static_patterns + media_patterns + patterns('',
    url(r'^admin/', include(adminurls)),
    url(r'^api/', include(api_patterns)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^', include(ThemeHelper.get_theme_urls())),
)
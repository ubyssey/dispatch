from django.conf.urls import include, url

from rest_framework import routers

from dispatch.helpers.theme import ThemeHelper
from dispatch.apps.api.urls import urlpatterns as api_urls
from dispatch.apps.manager.urls import urlpatterns as admin_urls

urlpatterns = [
    url(r'^admin/', include(admin_urls)),
    url(r'^api/', include(api_urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^', include(ThemeHelper.get_theme_urls())),
]

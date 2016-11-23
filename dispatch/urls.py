from django.conf.urls import include, url

from rest_framework import routers

from dispatch.helpers.theme import ThemeHelper

urlpatterns = [
    url(r'^admin/', include('dispatch.apps.manager.urls', namespace='manager')),
    url(r'^api/', include('dispatch.apps.api.urls')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^', include(ThemeHelper.get_theme_urls())),
]

from django.conf.urls import include, url

from dispatch.urls import admin_urls, api_urls

urlpatterns = [
    url(r'^admin/', include(admin_urls)),
    url(r'^api/', include(api_urls)),
]

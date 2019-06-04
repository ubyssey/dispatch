from django.urls import include, re_path

from dispatch.urls import admin_urls, api_urls

urlpatterns = [
    re_path(r'^admin/', include(admin_urls)),
    re_path(r'^api/', include(api_urls)),
]

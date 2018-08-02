from django.conf.urls import include, url

from dispatch.admin import urls as admin_urls
from dispatch.api import urls as api_urls

urlpatterns = [
    url(r'^admin/', include(admin_urls)),
    url(r'^api/', include(api_urls)),
]

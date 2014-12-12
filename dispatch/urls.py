from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework import routers
from api import views
from dispatch.helpers import ThemeHelper

admin.autodiscover()

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^', include(ThemeHelper.get_theme_urls())),
)

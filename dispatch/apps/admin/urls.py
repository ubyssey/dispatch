from django.conf.urls import patterns, include, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^', include(admin.site.urls)),
    url(r'articles/?', 'dispatch.apps.admin.views.articles')
)

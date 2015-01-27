from django.conf.urls import patterns, include, url
from django.contrib import admin
from . import views

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^', include(admin.site.urls)),
    url(r'articles/?', views.articles),
    url(r'article/(\d*)/?$', views.article_edit),
    url(r'article', views.article_add),
)

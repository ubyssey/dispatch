from django.conf.urls import patterns, include, url
from django.contrib import admin
from . import views

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^', include(admin.site.urls)),
    url(r'users/?', views.users),
    url(r'user/(\d*)/?$', views.user_edit),
    url(r'articles/?$', views.articles),
    url(r'article/(\d*)/?$', views.article_edit),
    url(r'article/delete/(\d*)/?$', views.article_delete),
    url(r'article/add/?$', views.article_add),
    url(r'section/(?P<section>[-\w]+)/?', views.section),
)

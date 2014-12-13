from django.conf.urls import patterns, include, url

import views

theme_urls = patterns('',
    url(r'^', views.home),
    url(r'^(?P<section>[-\w]+)/(?P<slug>[-\w]+)/', views.article),
)

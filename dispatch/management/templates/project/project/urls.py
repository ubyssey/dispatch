from django.conf.urls import patterns, url
from views import home

theme_urls = patterns('',
    url(r'^$', home),
)

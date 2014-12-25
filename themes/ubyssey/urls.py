from django.conf.urls import patterns, include, url
from views import UbysseyTheme

theme = UbysseyTheme()

theme_urls = patterns('',
    url(r'^(?P<section>[-\w]+)/(?P<slug>[-\w]+)/', theme.article),
    #url(r'themes/', theme.test),
    url(r'^', theme.home),
)

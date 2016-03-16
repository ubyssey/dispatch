from django.conf.urls import include, url

from views import DefaultTheme

theme = DefaultTheme()

theme_urls = [
    url(r'^(?P<section>[-\w]+)/(?P<slug>[-\w]+)/?', theme.article, name='article'),
    url(r'^(?P<slug>[-\w]+)/?', theme.section, name='section'),
    url(r'^login/?', theme.login),
    url(r'^logout/?', theme.logout),
    url(r'^register/?', theme.register),
    url(r'^/', theme.home),
]

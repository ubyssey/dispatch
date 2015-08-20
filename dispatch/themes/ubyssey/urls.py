from django.conf.urls import patterns, include, url
from views import UbysseyTheme

theme = UbysseyTheme()

theme_urls = patterns('',
    url(r'^login/?', theme.login),
    url(r'^logout/?', theme.logout),
    url(r'^register/?', theme.register),
    url(r'^author/(\d*)/articles/?', theme.author_articles, name='author-articles'),
    url(r'^author/(\d*)/?', theme.author, name='author'),
    url(r'^(?P<section>[-\w]+)/(?P<slug>[-\w]+)/?', theme.article, name='article'),
    url(r'^(?P<section>[-\w]+)/$', theme.section, name='section'),
    url(r'^$', theme.home, name='home'),
)

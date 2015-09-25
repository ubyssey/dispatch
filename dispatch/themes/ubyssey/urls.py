from django.conf.urls import patterns, include, url
from views import UbysseyTheme
from dispatch.apps.frontend.themes.default.urls import theme_urls

theme = UbysseyTheme()

theme_urls = patterns('',
    url(r'^search/?', theme.search, name='search'),
    url(r'^(?P<section>[-\w]+)/(?P<slug>[-\w]+)/?', theme.article, name='article'),
    url(r'^(?P<slug>[-\w]+)/?', theme.section, name='section'),
    #url(r'^login/?', theme.login),
    #url(r'^logout/?', theme.logout),
    #url(r'^register/?', theme.register),
    url(r'^author/(?P<slug>[-\w]+)/articles/?', theme.author_articles, name='author-articles'),
    url(r'^author/(?P<slug>[-\w]+)/?', theme.author, name='author'),
    url(r'^$', theme.home, name='home'),

)

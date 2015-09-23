from django.conf.urls import patterns, include, url
from views import UbysseyTheme
from dispatch.apps.frontend.themes.default.urls import theme_urls

theme = UbysseyTheme()

theme_urls = theme_urls(theme) + patterns('',
    url(r'^$', theme.home, name='home'),
    url(r'^search/?', theme.search, name='search'),
    url(r'^author/(?P<slug>[-\w]+)/articles/?', theme.author_articles, name='author-articles'),
    url(r'^author/(?P<slug>[-\w]+)/?', theme.author, name='author'),
)

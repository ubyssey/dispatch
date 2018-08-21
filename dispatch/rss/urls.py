from django.conf.urls import url
from dispatch.rss.feeds import PodcastFeed

urlpatterns = [
    url(r'^podcasts/(?P<slug>[-\w]+)/', PodcastFeed(), name='rss'),
]

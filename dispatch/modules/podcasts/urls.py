from django.conf.urls import url
from dispatch.moduels.podcasts.feeds import PodcastFeed

urlpatterns = [
    url(r'^podcasts/(?P<slug>[-\w]+)/', PodcastFeed(), name='rss'),
]

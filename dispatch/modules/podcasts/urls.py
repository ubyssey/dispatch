from django.conf.urls import url
from dispatch.modules.podcasts.feeds import PodcastFeed

urlpatterns = [
    url(r'^(?P<slug>[-\w]+)/', PodcastFeed(), name='podcast'),
]

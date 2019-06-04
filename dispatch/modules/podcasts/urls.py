from django.urls import re_path
from dispatch.modules.podcasts.feeds import PodcastFeed

urlpatterns = [
    re_path(r'^(?P<slug>[-\w]+)/', PodcastFeed(), name='podcast'),
]

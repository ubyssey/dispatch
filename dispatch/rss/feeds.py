from django.contrib.syndication.views import Feed
from django.urls import reverse
from django.conf import settings

from dispatch.modules.podcasts.models import Podcast, PodcastEpisode


class PodcastFeed(Feed):

    def __init__(self, podcast):
        self.title = podcast.title
        self.description = podcast.description
        self.link = settings.BASE_URL
        self.podcast = podcast


    def items(self):
        return PodcastEpisode.objects.filter(podcast=self.podcast).order_by('-published_at')[:5]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.description

    def item_pubdate(self, item):
        return item.published_at

    def item_guid(self, item):
        return item.id

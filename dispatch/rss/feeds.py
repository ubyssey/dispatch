from django.contrib.syndication.views import Feed
from django.urls import reverse
from django.conf import settings

from dispatch.modules.podcasts.models import Podcast, PodcastEpisode


class PodcastFeed(Feed):

    def get_object(self, request, slug=None):
        return Podcast.objects.get(slug=slug)

    def title(self, obj):
        return obj.title

    def link(self):
        return settings.BASE_URL

    def description(self, obj):
        return obj.description

    def items(self, obj):
        return PodcastEpisode.objects.filter(podcast=obj).order_by('-published_at')[:5]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.description

    def item_pubdate(self, item):
        return item.published_at

    def item_guid(self, item):
        return item.id

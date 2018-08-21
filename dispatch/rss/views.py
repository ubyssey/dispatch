from django.http import Http404

from dispatch.modules.podcasts.models import Podcast, PodcastEpisode
from dispatch.rss.feeds import PodcastFeed

def podcast(request, slug=None):
    """Generates an xml feed for each podcast"""

    try:
        podcast = Podcast.objects.get(slug=slug)
    except:
        raise Http404('RSS feed could not be found')

    podcast_feed = PodcastFeed(podcast)

    return podcast_feed(request)

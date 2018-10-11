from django.contrib.syndication.views import Feed
from django.utils.feedgenerator import Rss201rev2Feed
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.conf import settings

from dispatch.modules.podcasts.models import Podcast, PodcastEpisode

class iTunesPodcastsFeedGenerator(Rss201rev2Feed):

  def rss_attributes(self):
    return {
        'version': self._version,
        'xmlns:atom': 'http://www.w3.org/2005/Atom',
        'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
    }

  def add_root_elements(self, handler):
    super(iTunesPodcastsFeedGenerator, self).add_root_elements(handler)

    handler.addQuickElement('itunes:subtitle', self.feed['subtitle'])
    handler.addQuickElement('itunes:author', self.feed['author'])
    handler.addQuickElement('itunes:summary', self.feed['description'])
    handler.addQuickElement('itunes:explicit', self.feed['explicit'])

    handler.startElement('itunes:category', {'text': self.feed['category']})
    handler.endElement('itunes:category')

    handler.startElement('itunes:owner', {})
    handler.addQuickElement('itunes:name', self.feed['itunes_name'])
    handler.addQuickElement('itunes:email', self.feed['itunes_email'])
    handler.endElement('itunes:owner')

    handler.startElement('itunes:image', {'href': self.feed['itunes_image_url']})
    handler.endElement('itunes:image')

  def add_item_elements(self, handler, item):
    super(iTunesPodcastsFeedGenerator, self).add_item_elements(handler, item)

    handler.addQuickElement('itunes:summary', item['summary'])
    handler.addQuickElement('itunes:explicit', item['explicit'])

    handler.startElement('enclosure', {
        'length': item['duration'],
        'type': item['type'],
        'url': item['url']
    })
    handler.endElement('enclosure')

class PodcastFeed(Feed):

    feed_type = iTunesPodcastsFeedGenerator

    def get_object(self, request, slug=None):
        return Podcast.objects.get(slug=slug)

    def items(self, obj):
        return PodcastEpisode.objects.filter(podcast=obj) \
            .order_by('-published_at')[:5]

    def title(self, obj):
        return obj.title

    def link(self):
        return settings.BASE_URL

    def description(self, obj):
        return obj.description

    def item_title(self, item):
        return item.title

    def item_link(self, item):
        return item.file.url

    def item_description(self, item):
        return item.description

    def item_pubdate(self, item):
        return item.published_at

    def item_guid(self, item):
        return item.file.url

    def feed_extra_kwargs(self, feed):
        return {
            'author': feed.author,
            'itunes_name': feed.owner_name,
            'itunes_email': feed.owner_email,
            'itunes_image_url': feed.image.img.url if feed.image else '',
            'category': feed.category,
            'explicit': feed.explicit,
        }

    def item_extra_kwargs(self, item):
        return {
            'duration': str(item.duration),
            'url': item.file.url,
            'type': item.type,
            'summary': item.description,
            'explicit': item.explicit
        }

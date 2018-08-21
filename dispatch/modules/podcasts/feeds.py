from django.contrib.syndication.views import Feed
from django.utils.feedgenerator import Rss201rev2Feed

from django.urls import reverse
from django.conf import settings
from dispatch.modules.podcasts.models import Podcast, PodcastEpisode

class iTunesPodcastsFeedGenerator(Rss201rev2Feed):

  def rss_attributes(self):
    return {u"version": self._version, u"xmlns:atom": u"http://www.w3.org/2005/Atom", u'xmlns:itunes': u'http://www.itunes.com/dtds/podcast-1.0.dtd'}

  def add_root_elements(self, handler):
      super(iTunesPodcastsFeedGenerator, self).add_root_elements(handler)
      handler.addQuickElement(u'itunes:subtitle', self.feed['subtitle'])
      handler.addQuickElement(u'itunes:author', self.feed['author_name'])
      handler.addQuickElement(u'itunes:summary', self.feed['description'])
      handler.addQuickElement(u'itunes:explicit', self.feed['iTunes_explicit'])
      handler.startElement(u"itunes:owner", {})
      handler.addQuickElement(u'itunes:name', self.feed['iTunes_name'])
      handler.addQuickElement(u'itunes:email', self.feed['iTunes_email'])
      handler.endElement(u"itunes:owner")
      handler.addQuickElement(u'itunes:image', self.feed['iTunes_image_url'])

  def add_item_elements(self,  handler, item):
    super(iTunesPodcastsFeedGenerator, self).add_item_elements(handler, item)
    handler.addQuickElement(u'iTunes:summary',item['summary'])
    handler.addQuickElement(u'iTunes:explicit',item['explicit'])


class PodcastFeed(Feed):

    iTunes_email = u'author@example.com'
    iTunes_explicit = u'no'
    feed_type = iTunesPodcastsFeedGenerator

    def get_object(self, request, slug=None):
        return Podcast.objects.get(slug=slug)

    def iTunes_image_url(self, obj):
        return settings.BASE_URL.strip('/') + obj.image.get_absolute_url()

    def iTunes_name(self,obj):
        return obj.author

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

    def feed_extra_kwargs(self, obj):
        extra = {}
        extra['iTunes_name'] = self.iTunes_name(obj)
        extra['iTunes_email'] = self.iTunes_email
        extra['iTunes_image_url'] = self.iTunes_image_url(obj)
        extra['iTunes_explicit'] = self.iTunes_explicit
        return extra

    def item_extra_kwargs(self, item):
        return {'summary':item.description, 'explicit':'no'}

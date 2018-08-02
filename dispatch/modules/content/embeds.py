from django.template import loader

class EmbedException(Exception):
    pass

class EmbedLibrary(object):
    def __init__(self):
        self.library = {}

    def register(self, type, function):
        self.library[type] = function

    def get_controller(self, type):

        if type in self.library:
            return self.library[type]
        else:
            raise EmbedException('No embed controller registered for type %s' % type)

    def to_json(self, type, data):
        return self.get_controller(type).to_json(data)

    def render(self, type, data):
        return self.get_controller(type).render(data)

embeds = EmbedLibrary()

def tag(tag, content):
    return u'<{tag}>{content}</{tag}>'.format(tag=tag, content=content)

def maptag(tagname, contents):
    """Returns the HTML produced from enclosing each item in
    `contents` in a tag of type `tagname`"""
    return u''.join(tag(tagname, item) for item in contents)

class AbstractEmbed(object):
    @staticmethod
    def to_json(data):
        return data

class AbstractTemplateEmbed(AbstractEmbed):
    TEMPLATE = None

    @classmethod
    def render(self, data):
        template = loader.get_template(self.TEMPLATE)
        return template.render(self.prepare_data(data))

    @classmethod
    def prepare_data(self, data):
        return data

class ListEmbed(AbstractEmbed):
    @classmethod
    def render(self, data):
        return tag('ul', maptag('li', data))

class HeaderEmbed(AbstractEmbed):
    @classmethod
    def render(self, data):
        size = data.get('size').lower()
        return tag(size if size in ['h1', 'h2', 'h3'] else 'h1',
                   data['content'])

class CodeEmbed(AbstractEmbed):
    @classmethod
    def render(self, data):
        tags = {
            'css': 'style',
            'javascript': 'script'
        }
        try:
            return tag(tags[data['mode']], data['content'])
        except KeyError:
            return '<div class="o-article-embed o-article-embed--code">' + data['content'] + '</div>'

class VideoEmbed(AbstractTemplateEmbed):
    TEMPLATE = 'embeds/video.html'

class AdvertisementEmbed(AbstractTemplateEmbed):
    TEMPLATE = 'embeds/advertisement.html'

class PullQuoteEmbed(AbstractTemplateEmbed):
    TEMPLATE = 'embeds/quote.html'

class WidgetEmbed(AbstractEmbed):
    @classmethod
    def render(self, data):

        from dispatch.theme import ThemeManager
        from dispatch.theme.exceptions import ZoneNotFound, WidgetNotFound

        try:
            widget_id = data['widget_id']
            widget = ThemeManager.Widgets.get(widget_id)
        except:
            return ''

        return widget.render(data=data['data'])

class ImageEmbed(AbstractTemplateEmbed):
    TEMPLATE = 'embeds/image.html'

    @classmethod
    def get_image(self, id):
        from dispatch.models import Image

        try:
            return Image.objects.get(pk=id)
        except Image.DoesNotExist:
            raise EmbedException('Image with id %d does not exist' % id)

    @classmethod
    def prepare_data(self, data):
        id = data['image_id']

        image = self.get_image(id)

        return {
            'image': image,
            'style': data.get('style', None),
            'width': data.get('width', None),
            'caption': data.get('caption', None),
            'credit': data.get('credit', None)
        }

class GalleryEmbed(AbstractTemplateEmbed):
    TEMPLATE = 'embeds/gallery.html'

    @classmethod
    def get_gallery(self, id):
        from dispatch.models import ImageGallery

        try:
            return ImageGallery.objects.get(pk=id)
        except ImageGallery.DoesNotExist:
            raise EmbedException('Image Gallery with id %d does not exist' % id)

    @classmethod
    def prepare_data(self, data):
        id = data['id']

        gallery = self.get_gallery(id)
        images = gallery.images.all()

        return {
            'id': gallery.id,
            'title': gallery.title,
            'cover': images[0],
            'thumbs': images[1:5],
            'images': images,
            'size': len(images)
        }

embeds.register('widget', WidgetEmbed)
embeds.register('quote', PullQuoteEmbed)
embeds.register('code', CodeEmbed)
embeds.register('advertisement', AdvertisementEmbed)
embeds.register('header', HeaderEmbed)
embeds.register('list', ListEmbed)
embeds.register('video', VideoEmbed)
embeds.register('image', ImageEmbed)
embeds.register('gallery', GalleryEmbed)

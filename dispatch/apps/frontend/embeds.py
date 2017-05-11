from django.template import loader
from dispatch.apps.api.serializers import ImageSerializer
from dispatch.apps.content.models import Image

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


embedlib = EmbedLibrary()


def tag(tag, content):
    return u'<{tag}>{content}</{tag}>'.format(tag=tag, content=content)

def maptag(tagname, contents):
    """Returns the HTML produced from enclosing each item in
    `contents` in a tag of type `tagname`"""
    return u''.join(tag(tagname, item) for item in contents)


class AbstractController(object):

    @staticmethod
    def to_json(data):
        return data

class AbstractTemplateRenderController(AbstractController):

    TEMPLATE = None

    @classmethod
    def render(self, data):
        template = loader.get_template(self.TEMPLATE)
        return template.render(self.prepare_data(data))

    @classmethod
    def prepare_data(self, data):
        return data


class ListController(AbstractController):

    @classmethod
    def render(self, data):
        return tag('ul', maptag('li', data))

class HeaderController(AbstractController):

    @classmethod
    def render(self, data):
        size = data.get('size').lower()
        return tag(size if size in ['h1', 'h2', 'h3'] else 'h1',
                   data['content'])

class CodeController(AbstractController):

    @classmethod
    def render(self, data):
        tags = {
            'css': 'style',
            'javascript': 'script'
        }
        try:
            return tag(tags[data['mode']], data['content'])
        except KeyError:
            return data['content']

class VideoController(AbstractTemplateRenderController):

    TEMPLATE = 'embeds/video.html'

class AdvertisementController(AbstractTemplateRenderController):

    TEMPLATE = 'embeds/advertisement.html'

class PullQuoteController(AbstractTemplateRenderController):

    TEMPLATE = 'embeds/quote.html'

class ImageController(AbstractTemplateRenderController):

    TEMPLATE = 'embeds/image.html'

    @classmethod
    def get_image(self, id):
        try:
            return Image.objects.get(pk=id)
        except Image.DoesNotExist:
            raise EmbedException('Image with id %d does not exist' % id)

    @classmethod
    def to_json(self, data):

        id = data['image_id']

        image = self.get_image(id)

        serializer = ImageSerializer(image)
        image_data = serializer.data

        return {
            'image': image_data,
            'caption' : data['caption'],
            'credit' : data['credit']
        }

    @classmethod
    def prepare_data(self, data):

        id = data['image_id']

        image = self.get_image(id)

        return {
            'image': image,
            'caption': data['caption'],
            'credit': data['credit']
        }

embedlib.register('quote', PullQuoteController)
embedlib.register('code', CodeController)
embedlib.register('advertisement', AdvertisementController)
embedlib.register('header', HeaderController)
embedlib.register('list', ListController)
embedlib.register('video', VideoController)
embedlib.register('image', ImageController)

from dispatch.modules.content.models import Image, ImageGallery

class Loader(object):
    """A Loader is used to efficiently fetch data for content embeds.

    Each loader has a corresponding embed type, and facilitates the prefecting
    and serialization of models used in that embed.
    """
    def __init__(self, serializer):
        self.serializer = serializer

    def serialize(self, instance):
        """Returns a serialized version of the given instance using `self.serializer`"""
        return self.serializer(instance).data

class ImageLoader(Loader):
    def get_id(self, data):
        """Returns the id for an image instance."""
        return data['image_id']

    def fetch(self, ids):
        """Returns a dictionary of ids to Image instances with prefetched Authors"""
        return Image.objects.prefetch_related('authors').in_bulk(ids)

    def sanitize(self, data):
        if 'image' in data:
            del data['image']
        return data

class ImageGalleryLoader(Loader):
    def get_id(self, data):
        """Returns the id for a gallery instance."""
        return data['id']

    def fetch(self, ids):
        """Returns a dictionary of ids to ImageGallery instances with prefetched Authors"""
        return ImageGallery.objects.prefetch_related('images__image__authors').in_bulk(ids)

    def sanitize(self, data):
        if 'gallery' in data:
            del data['gallery']
        return data

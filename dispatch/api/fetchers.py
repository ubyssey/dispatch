from dispatch.modules.content.models import Image, ImageGallery

class Fetcher(object):
    def __init__(self, serializer):
        self.serializer = serializer

    def serialize(self, instance):
        return self.serializer(instance).data

class ImageFetcher(Fetcher):
    def get_id(self, data):
        """Returns the id from an image embed dictionary."""
        return data['image_id']

    def fetch(self, ids):
        """Returns a dictionary of ids to Image instances with prefetched Authors"""
        return Image.objects.prefetch_related('authors').in_bulk(ids)

class ImageGalleryFetcher(Fetcher):
    def get_id(self, data):
        """Returns the id from a gallery embed dictionary."""
        return data['id']

    def fetch(self, ids):
        """Returns a dictionary of ids to ImageGallery instances with prefetched Authors"""
        return ImageGallery.objects.prefetch_related('images__image__authors').in_bulk(ids)

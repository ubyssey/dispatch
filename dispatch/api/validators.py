from dispatch.apps.api.exceptions import InvalidFilename, InvalidGalleryAttachments
from dispatch.apps.content.models import Image

def all_ascii(s):
    return all(ord(c) < 128 for c in s)

def ValidFilename(value):
    if not all_ascii(value.name):
        raise InvalidFilename('The filename cannot contain non-ASCII characters')

def ValidateImageGallery(data):
    for attachment in data:
        try:
            Image.objects.get(pk=attachment['image_id'])
        except Image.DoesNotExist:
            raise InvalidGalleryAttachments('One or more images does not exist')
        except KeyError:
            raise InvalidGalleryAttachments('One or more image ids were not provided')

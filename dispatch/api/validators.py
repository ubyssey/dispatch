from rest_framework.exceptions import ValidationError

from django.contrib.auth.password_validation import validate_password

from dispatch.api.exceptions import InvalidFilename, InvalidGalleryAttachments
from dispatch.models import Image, Person

class PasswordValidator(object):

    def __init__(self, confirm_field):
        self.confirm_field = confirm_field

    def set_context(self, serializer_field):
        self.data = serializer_field.parent.initial_data
        self.instance = serializer_field.parent.instance

    def __call__(self, value):
        if value != self.data.get(self.confirm_field):
            raise ValidationError('Passwords do not match')

        validate_password(value, user=self.instance)

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

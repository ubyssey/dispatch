from rest_framework.exceptions import ValidationError

from django.contrib.auth.password_validation import validate_password

from dispatch.api.exceptions import InvalidFilename, InvalidGalleryAttachments
from dispatch.models import Image, Person, Section, Page

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

def FilenameValidator(value):
    if not all_ascii(value.name):
        raise InvalidFilename('The filename cannot contain non-ASCII characters')

def ImageGalleryValidator(data):
    for attachment in data:
        try:
            Image.objects.get(pk=attachment['image_id'])
        except Image.DoesNotExist:
            raise InvalidGalleryAttachments('One or more images does not exist')
        except KeyError:
            raise InvalidGalleryAttachments('One or more image ids were not provided')

class SlugValidator(object):
    def set_context(self, serializer_field):
        self.instance = serializer_field.parent.instance
        self.model = serializer_field.parent.Meta.model

    def __call__(self, slug):
        if self.instance is None:
            if self.model.objects.filter(slug=slug).exists():
                raise ValidationError('%s with slug \'%s\' already exists.' % (self.model.__name__, slug))
        else:
            if self.model.objects.filter(slug=slug).exclude(parent=self.instance.parent).exists():
                raise ValidationError('%s with slug \'%s\' already exists.' % (self.model.__name__, slug))

def AuthorValidator(data):
    """Raise a ValidationError if data does not match the author format."""
    if not isinstance(data, list):
        # Convert single instance to a list
        data = [data]

    for author in data:
        if 'person' not in author:
            raise ValidationError('An author must contain a person.')
        if 'type' in author and not isinstance(author['type'], basestring):
            # If type is defined, it should be a string
            raise ValidationError('The author type must be a string.')

class ColumnSlugValidator(object):
    def set_context(self, serializer_field):
        self.instance = serializer_field.parent.instance
        self.model = serializer_field.parent.Meta.model

    def __call__(self, slug):
        if Section.objects.filter(slug=slug).exists():
            raise ValidationError('A section with that slug already exists.')
        if Page.objects.filter(slug=slug).exists():
            raise ValidationError('A page with that slug already exists')
        if self.instance is None:
            if self.model.objects.filter(slug=slug).exists():
                raise ValidationError('A column with that slug already exists')
        else:
            if self.model.objects.filter(slug=slug).exclude(id=self.instance.id).exists():
                raise ValidationError('A column with that slug already exists')

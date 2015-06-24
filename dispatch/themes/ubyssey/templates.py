from dispatch.apps.frontend.helpers import templates
from dispatch.apps.frontend.templates import BaseTemplate
from dispatch.apps.frontend.fields import TextField, ModelField, SelectField

class Default(BaseTemplate):

    NAME = 'Default'
    SLUG = 'default'

    IMAGE_SIZE_OPTIONS = (
        ('default', 'Default'),
        ('full', 'Full')
    )

    fields = (
        ('image_size', 'Image Size', SelectField(options=IMAGE_SIZE_OPTIONS)),
    )

class FullWidth(BaseTemplate):

    NAME = 'Full width story'
    SLUG = 'fw-story'

    IMAGE_SIZE_OPTIONS = (
        ('default', 'Default'),
        ('full', 'Full')
    )

    fields = (
        ('test', 'Test', TextField()),
        ('image_size', 'Image Size', SelectField(options=IMAGE_SIZE_OPTIONS))
    )

templates.register(Default)
templates.register(FullWidth)
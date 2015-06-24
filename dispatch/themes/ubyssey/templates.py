from dispatch.apps.frontend.helpers import templates
from dispatch.apps.frontend.templates import BaseTemplate
from dispatch.apps.frontend.fields import TextField, ModelField, SelectField

class FullWidth:

    NAME = 'Full width story'
    SLUG = 'fw-story'

templates.register(FullWidth)
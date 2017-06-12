from dispatch.apps.frontend.helpers import templates
from dispatch.apps.frontend.templates import BaseTemplate

class Default(BaseTemplate):

    NAME = 'Default'
    SLUG = 'default'

templates.register(Default)

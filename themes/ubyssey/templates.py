from dispatch.apps.frontend.helpers import templates

class Homepage:
    component_spots = ('multi-zone',)

class FullWidth:

    NAME = 'Full width story'
    SLUG = 'fw-story'

templates.register(Homepage)
templates.register(FullWidth)
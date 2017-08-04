from dispatch.theme import register
from dispatch.theme.widgets import Zone

@register.zone
class Embed(Zone):
    id = 'embed'
    name = 'Embed'

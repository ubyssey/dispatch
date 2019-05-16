from django import template

from dispatch.theme import ThemeManager
from dispatch.theme.exceptions import ZoneNotFound, WidgetNotFound
from django.templatetags.static import static
from django.conf import settings
register = template.Library()

@register.simple_tag
def zone(zone_id, **kwargs):
    """Renders the contents of the zone with given zone_id."""

    try:
        zone = ThemeManager.Zones.get(zone_id)
    except ZoneNotFound:
        return ''

    try:
        return zone.widget.render(add_context=kwargs)
    except (WidgetNotFound, AttributeError):
        pass

    return ''

@register.simple_tag
def add_version(path):
    file_name, file_extension = path.split('.')
    return static('%s-%s.%s' % (file_name, settings.VERSION, file_extension) )

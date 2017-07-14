from django import template

from dispatch.theme import ThemeManager
from dispatch.theme.exceptions import ZoneNotFound

register = template.Library()

@register.simple_tag
def zone(zone_id):

    try:
        zone = ThemeManager.Zones.get(zone_id)
    except ZoneNotFound:
        return None

    widget = zone.widget

    if widget is not None:
        return zone.widget.render()

    return ''

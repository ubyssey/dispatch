from uuid import UUID

from django.core.validators import slug_re

from dispatch.theme.exceptions import InvalidZone, InvalidWidget

def is_valid_slug(slug):
    """Uses Django's slug regex to test if id is valid"""
    return slug_re.match(slug)

def has_valid_id(o):
    return hasattr(o, 'id') and o.id and is_valid_slug(o.id)

def has_valid_name(o):
    return hasattr(o, 'name') and o.name

def has_valid_template(o):
    return hasattr(o, 'template') and o.template

def validate_widget(widget):
    """Checks that the given widget contains the required fields"""

    if not has_valid_id(widget):
        raise InvalidWidget("%s must contain a valid 'id' attribute" % widget.__name__)

    if not has_valid_name(widget):
        raise InvalidWidget("%s must contain a valid 'name' attribute" % widget.__name__)

    if not has_valid_template(widget):
        raise InvalidWidget("%s must contain a valid 'template' attribute" % widget.__name__)

    if not hasattr(widget, 'zones') or not widget.zones:
        raise InvalidWidget("%s must be compatible with at least one zone" % widget.__name__)

def validate_zone(zone):
    """Checks that the given zone contains the required fields"""

    if not has_valid_id(zone):
        raise InvalidZone("%s must contain a valid 'id' attribute" % zone.__name__)

    if not has_valid_name(zone):
        raise InvalidZone("%s must contain a valid 'name' attribute" % zone.__name__)

def is_valid_id(id):
    """Return True if id is a valid integer or UUID, False otherwise."""
    return isinstance(id, int) or is_valid_uuid(id)


def is_valid_uuid(id):
    """Return True if id is a valid UUID, False otherwise."""
    if not isinstance(id, basestring):
        return False

    try:
        val = UUID(id, version=4)
    except ValueError:
        return False

    return True
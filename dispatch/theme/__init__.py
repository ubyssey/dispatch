from collections import OrderedDict

from dispatch.theme.validators import validate_widget, validate_zone
from dispatch.theme.exceptions import ZoneNotFound, WidgetNotFound

class ThemeRegistry(object):

    def __init__(self):
        self.zones = OrderedDict()
        self.widgets = OrderedDict()

    def zone(self, zone):
        validate_zone(zone)
        self.zones[zone.id] = zone
        return zone

    def widget(self, widget):
        validate_widget(widget)
        self.widgets[widget.id] = widget

        for zone in widget.zones:
            try:
                zone.register_widget(widget)
            except KeyError:
                raise InvalidWidget(
                    "Zone with id '%s' must be registered before it can be used by %s" % (zone.id, widget.name)
                )

        return widget

register = ThemeRegistry()

class ThemeManager(object):

    class Zones:

        @staticmethod
        def list():
            """Return list of registered zones"""
            return [Z() for Z in register.zones.values()]

        @staticmethod
        def get(id):
            """Return a specific zone"""
            try:
                return register.zones[id]()
            except KeyError:
                raise ZoneNotFound("Zone with id '%s' does not exist" % id)

    class Widgets:

        @staticmethod
        def get(id):
            """Return a specific widget"""
            try:
                return register.widgets[id]()
            except KeyError:
                raise WidgetNotFound("Widget with id '%s' does not exist" % id)

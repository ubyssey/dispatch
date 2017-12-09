import re
from collections import OrderedDict

from dispatch.theme.validators import validate_widget, validate_zone
from dispatch.theme.exceptions import ZoneNotFound, WidgetNotFound, TemplateNotFound
from dispatch.theme.templates import Default as DefaultTemplate

class ThemeRegistry(object):
    def __init__(self):
        self.zones = OrderedDict()
        self.widgets = OrderedDict()
        self.templates = OrderedDict()
        self.register_defaults()

    def clear(self):
        for zone in self.zones.values():
            zone.clear_widgets()

        self.zones = OrderedDict()
        self.widgets = OrderedDict()
        self.templates = OrderedDict()
        self.register_defaults()

    def register_defaults(self):
        self.template(DefaultTemplate)

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

    def template(self, template):
        self.templates[template.id] = template
        return template

register = ThemeRegistry()

class ThemeManager(object):
    """ThemeManager is a facade for managing zones, widgets and templates."""

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

        @staticmethod
        def search(q):
            """Return list of zones matching query"""
            matches = []
            for Z in register.zones.values():
                if re.search(q, Z.name, re.IGNORECASE):
                    matches.append(Z())
            return matches

    class Widgets:
        @staticmethod
        def get(id):
            """Return a specific widget"""
            try:
                return register.widgets[id]()
            except KeyError:
                raise WidgetNotFound("Widget with id '%s' does not exist" % id)

    class Templates:
        @staticmethod
        def list():
            """Return list of registered templates"""
            return [T() for T in register.templates.values()]

        @staticmethod
        def get(id):
            """Return a specific template"""
            try:
                return register.templates[id]()
            except KeyError:
                raise TemplateNotFound("Template with id '%s' does not exist" % id)

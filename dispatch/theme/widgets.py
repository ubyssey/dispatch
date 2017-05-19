from collections import OrderedDict

from django.template import loader

from dispatch.apps.frontend.models import Zone as ZoneModel
from dispatch.theme import ThemeManager
from dispatch.theme.fields import Field

class MetaZone(type):
    def __init__(cls, name, bases, nmspc):
        cls._widget = None
        cls._widgets = []

        super(MetaZone, cls).__init__(name, bases, nmspc)

class Zone(object):

    __metaclass__ = MetaZone

    @property
    def widget(self):

        if not self._widget:
            try:
                zone = ZoneModel.objects.get(zone_id=self.id)

                widget = ThemeManager.Widgets.get(zone.widget_id)
                widget.set_data(zone.data)

                self._widget = widget
            except ZoneModel.DoesNotExist:
                pass

        return self._widget

    @property
    def widgets(self):
        """Return the widgets compatible with this zone"""
        return [W() for W in self._widgets]

    @classmethod
    def register_widget(cls, widget):
        """Register a widget with this zone"""
        cls._widgets.append(widget)

    @classmethod
    def clear_widgets(cls):
        """Clear all widgets registered with this zone"""
        cls._widgets = []

    def save(self, validated_data):
        """Save widget data for this zone"""

        widget = ThemeManager.Widgets.get(validated_data['id'])
        widget.set_data(validated_data['data'])

        (zone, created) = ZoneModel.objects.get_or_create(zone_id=self.id)

        zone.widget_id = widget.id
        zone.data = widget.data

        return zone.save()

    def delete(self):
        """Delete widget data for this zone"""
        ZoneModel.objects.get(zone_id=self.id).delete()

class MetaWidget(type):
    
    @classmethod
    def __prepare__(self, name, bases):
        return OrderedDict()

    def __new__(self, name, bases, classdict):

        def prepare_fields():

            def get_field(name, field):
                field.name = name
                return field

            fields = filter(lambda f: f[0] != 'fields' and isinstance(f[1], Field), classdict.items())

            return [get_field(name, field) for name, field in fields]

        classdict['fields'] = prepare_fields()

        return type.__new__(self, name, bases, classdict)

class Widget(object):

    __metaclass__ = MetaWidget

    def __init__(self):
        self.data = {}

    def set_data(self, data):
        """Sets data for each field"""
        self.data = data

    def get_data(self):
        """Returns data from each field"""
        result = {}

        for field in self.fields:
            result[field.name] = self.data.get(field.name)

        return result

    def to_json(self):
        """Return JSON representation for this widget"""

        result = {}

        for field in self.fields:
            result[field.name] = field.to_json(self.data.get(field.name))

        return result

    def prepare_data(self):
        """Prepare widget data for template"""

        result = {}

        for field in self.fields:
            data = self.data.get(field.name)
            if data:
                result[field.name] = field.prepare_data(data)
            else:
                result[field.name] = None

        return result

    def render(self):
        """Renders the widget as HTML"""

        template = loader.get_template(self.template)
        return template.render(self.prepare_data())

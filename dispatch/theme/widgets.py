from collections import OrderedDict

from django.template import loader

from dispatch.apps.frontend.models import Zone as ZoneModel
from dispatch.theme import ThemeManager
from dispatch.theme.fields import Field
from dispatch.theme.exceptions import InvalidField

class MetaZone(type):
    def __init__(cls, name, bases, nmspc):
        cls._widget = None
        cls._widgets = []

        super(MetaZone, cls).__init__(name, bases, nmspc)

class Zone(object):

    __metaclass__ = MetaZone

    def __init__(self):
        self._is_loaded = False
        self._zone = None
        self._widget = None

    def _load_zone(self):
        try:
            self._zone = ZoneModel.objects.get(zone_id=self.id)
            self._widget = ThemeManager.Widgets.get(self._zone.widget_id)
            self._widget.set_data(self._zone.data)
            self._is_loaded = True
        except ZoneModel.DoesNotExist:
            pass

    @property
    def data(self):
        if not self._is_loaded:
            self._load_zone()

        if not self._zone or not self._widget:
            return {}

        return self._widget.to_json()

    @property
    def widget(self):

        if not self._is_loaded:
            self._load_zone()

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

        (zone, created) = ZoneModel.objects.get_or_create(zone_id=self.id)

        zone.widget_id = validated_data['widget']
        zone.data = validated_data['data']

        return zone.save()

    def delete(self):
        """Delete widget data for this zone"""
        ZoneModel.objects.get(zone_id=self.id).delete()

class MetaWidget(type):

    def __new__(cls, name, bases, classdict):

        def prepare_fields():

            def get_field(name, field):
                field.name = name
                return field

            fields = filter(lambda f: f[0] != 'fields' and isinstance(f[1], Field), classdict.items())
            fields.sort(key=lambda f: f[1]._creation_counter)

            return [get_field(name, field) for name, field in fields]

        classdict['fields'] = prepare_fields()

        return type.__new__(cls, name, bases, classdict)

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
            # TODO: Refactor field.to_json to return only data
            result[field.name] = field.to_json(self.data.get(field.name))['data']

        return result

    def prepare_data(self):
        """Prepare widget data for template"""

        result = {}

        for field in self.fields:
            data = self.data.get(field.name)
            result[field.name] = field.prepare_data(data)

        return result

    def render(self):
        """Renders the widget as HTML"""

        template = loader.get_template(self.template)
        return template.render(self.prepare_data())

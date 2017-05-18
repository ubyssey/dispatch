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

class Widget(object):

    def __init__(self):
        self.data = {}

    @property
    def fields(self):
        """Return list of fields defined on this widget"""

        def get_field(name):
            field = getattr(self, name)
            field.name = name
            return field

        fields = filter(lambda a: a != 'fields' and isinstance(getattr(self, a), Field), dir(self))

        return [get_field(f) for f in fields]

    def set_data(self, data):
        """Sets data for each field"""

        self.data = data

        for field in self.fields:
            field.set_data(data.get(field.name))

    def get_data(self):
        """Returns data from each field"""
        result = {}

        for field in self.fields:
            result[field.name] = field.data

        return result

    def to_json(self):
        """Return JSON representation for this widget"""

        result = {}

        for field in self.fields:
            result[field.name] = field.to_json()

        return result

    def prepare_data(self):
        """Prepare widget data for template"""

        result = {}

        for field in self.fields:
            if field.data:
                result[field.name] = field.prepare_data()
            else:
                result[field.name] = None

        return result

    def render(self):
        """Renders the widget as HTML"""

        template = loader.get_template(self.template)
        return template.render(self.prepare_data())

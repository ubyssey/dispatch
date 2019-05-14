from collections import OrderedDict

from django.template import loader

from dispatch.theme import ThemeManager
from dispatch.theme.fields import MetaFields, Field
from dispatch.theme.exceptions import InvalidField, WidgetNotFound
from dispatch.theme.models import Zone as ZoneModel

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
            try:
                self._widget = ThemeManager.Widgets.get(self._zone.widget_id)
                self._widget.set_data(self._zone.data)
            except WidgetNotFound:
                self._widget = None
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
        """Return the widgets compatible with this zone."""
        return [W() for W in self._widgets]

    @classmethod
    def register_widget(cls, widget):
        """Register a widget with this zone."""
        cls._widgets.append(widget)

    @classmethod
    def clear_widgets(cls):
        """Clear all widgets registered with this zone."""
        cls._widgets = []

    def before_save(self, widget_id, data):
        try:
            widget = ThemeManager.Widgets.get(widget_id)
            return widget.before_save(data)
        except:
            return data

    def save(self, validated_data):
        """Save widget data for this zone."""

        (zone, created) = ZoneModel.objects.get_or_create(zone_id=self.id)

        zone.widget_id = validated_data['widget']
        zone.data = validated_data['data']

        # Call widget before-save hook on nested widgets
        for key in list(zone.data.keys()):
            if isinstance(zone.data[key], dict) and ('id' in zone.data[key].keys()) and ('data' in zone.data[key].keys()):
                zone.data[key]['data'] = self.before_save(zone.data[key]['id'], zone.data[key]['data'])

        # Call widget before-save hook
        zone.data = self.before_save(zone.widget_id, zone.data)

        return zone.save()

    def delete(self):
        """Delete widget data for this zone."""
        ZoneModel.objects.get(zone_id=self.id).delete()

class Widget(object):

    __metaclass__ = MetaFields

    accepted_keywords = ()
    """Accepted extra keyword arguments when rendered via template tag.
    Added to context for render if provided to templatetag.
    """

    def __init__(self):
        self.data = {}

    def set_data(self, data):
        """Sets data for each field."""
        self.data = data

    def get_data(self):
        """Returns data from each field."""
        result = {}

        for field in self.fields:
            result[field.name] = self.data.get(field.name)

        return result

    def to_json(self):
        """Return JSON representation for this widget."""
        result = {}

        for field in self.fields:
            result[field.name] = field.to_json(self.data.get(field.name))

        return result

    def prepare_data(self):
        """Prepare widget data for template."""
        result = {}

        for field in self.fields:
            data = self.data.get(field.name)
            result[field.name] = field.prepare_data(data)

        return result

    def render(self, data=None, add_context=None):
        """Renders the widget as HTML."""
        template = loader.get_template(self.template)

        if not data:
            data = self.context(self.prepare_data())

        if add_context is not None:
            for key, value in add_context.iteritems():
                if key in self.accepted_keywords:
                    data[key] = value

        return template.render(data)

    def context(self, data):
        """Optional method to add additional data to the deplate context before rendering."""
        return data

    def before_save(self, data):
        """Optional before-save hook that is called before widgets are saved."""
        return data

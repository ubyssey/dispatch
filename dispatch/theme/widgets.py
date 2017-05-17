from dispatch.apps.frontend.models import Zone as ZoneModel
from dispatch.theme import ThemeManager
from dispatch.theme.fields import Field

class Zone(object):
    id = None
    name = None

    _widget = None
    _widgets = []

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

    def set_widget(self, validated_data):

        widget = ThemeManager.Widgets.get(validated_data['id'])

        widget.set_data(validated_data['data'])

        # TODO: add validation step here

        self._widget = widget

    def save(self):

        (zone, created) = ZoneModel.objects.get_or_create(zone_id=self.id)

        zone.widget_id = self._widget.id
        zone.data = self._widget.data

        return zone.save()

class Widget(object):
    id = None
    name = None
    template = None
    zones = []

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
        self.data = data

    def to_json(self):
        """Return JSON representation for this widget"""
        # TODO
        pass

    def prepare_data(self):
        """Prepare widget data for template"""
        # TODO
        pass

    def render(self):
        """Renders the widget as HTML"""
        # TODO
        pass

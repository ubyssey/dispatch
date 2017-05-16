from dispatch.theme.widgets import Widget, Zone, validate_widget, validate_zone

class Registry(object):

    def __init__(self):
        self.zones = {}
        self.widgets = {}

    def zone(self, zone):
        validate_zone(zone)
        self.zones[zone.id] = zone

    def widget(self, widget):
        validate_widget(widget)
        self.widgets[widget.id] = widget

register = Registry()

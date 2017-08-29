from dispatch.theme.widgets import Zone, Widget
from dispatch.theme.fields import CharField, TextField, ArticleField, ImageField, WidgetField, Field
from dispatch.theme import register
from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.theme.exceptions import InvalidWidget, InvalidZone

class TestZone(Zone):
     id = 'test-zone'
     name = 'Test zone'

class TestZoneNoID(Zone):
     name = 'Test zone'

class TestZoneNoName(Zone):
     id = 'test-zone'

class TestWidgetNoID(Widget):
    name = 'Test widget'
    template = 'widgets/test-widget.html'
    zones = [TestZone]

class TestWidgetNoName(Widget):
    id = 'test-widget'
    template = 'widgets/test-widget.html'
    zones = [TestZone]

class TestWidgetNoTemplate(Widget):
    id = 'test-widget'
    name = 'Test widget'
    zones = [TestZone]

class TestWidgetNoZone(Widget):
    id = 'test-widget'
    name = 'Test widget'
    template = 'widgets/test-widget.html'

class WidgetAttributeTest(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_validate_missing_widget_attributes(self):
        """Validating widgets with various missing attributes should result in errors"""

        try:
            register.widget(TestWidgetNoID)
            self.fail("%s must contain a valid 'id' attribute" % widget.__name__)
        except InvalidWidget:
            pass

        try:
            register.widget(TestWidgetNoName)
            self.fail("%s must contain a valid 'name' attribute" % widget.__name__)
        except InvalidWidget:
            pass

        try:
            register.widget(TestWidgetNoTemplate)
            self.fail("%s must contain a valid 'template' attribute" % widget.__name__)
        except InvalidWidget:
            pass

        try:
            register.widget(TestWidgetNoZone)
            self.fail("%s must contain a valid 'Zone' attribute" % widget.__name__)
        except InvalidWidget:
            pass

class ZoneAttributeTest(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_validate_missing_zone_attributes(self):
        """Validating zone with various missing attributes should result in errors"""

        try:
            register.zone(TestZoneNoID)
            self.fail("%s must contain a valid 'id' attribute" % zone.__name__)
        except:
            pass

        try:
            register.zone(TestZoneNoName)
            self.fail("%s must contain a valid 'name' attribute" % zone.__name__)
        except:
            pass

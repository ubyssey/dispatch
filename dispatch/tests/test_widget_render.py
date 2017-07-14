from django.template import loader

from dispatch.theme import register
from dispatch.theme.widgets import Zone, Widget
from dispatch.theme.fields import CharField, TextField, ArticleField, ImageField, EventField, InvalidField
from dispatch.apps.content.models import Article, Image
from dispatch.apps.events.models import Event

from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers

class TestZone(Zone):
    id = 'test-zone'
    name = 'Test zone'

class TestWidget(Widget):
    id = 'test-widget'
    name = 'Test widget'
    template = 'widgets/test-widget.html'

    zones = [TestZone]

    title = CharField('Title')
    description = TextField('Description')
    article = ArticleField('Featured article')
    image = ImageField('Featured image')

class TestEventWidget(Widget):
    id = 'test-event-widget'
    name = 'Test Event Widget'
    template = 'widgets/test-widget.html'

    zones = [TestZone]

    title = CharField('Title')
    description = TextField('Description')
    events = EventField('Featured Events')

    def context(self,data):

        data['events'] = Event.objects.filter(is_published=True).order_by('-start_time')

        return data

class WidgetRenderTestCase(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_widget_to_json(self):
        """Ensure that to_json returns correct data"""

        article = DispatchTestHelpers.create_article(self.client)
        image = DispatchTestHelpers.create_image(self.client)

        widget = TestWidget()

        widget.set_data({
            'title': 'test title',
            'description': 'test description',
            'article': article.data['id'],
            'image' : image.data['id']
        })

        widget_json = widget.to_json()

        self.assertEqual(widget_json['article']['id'], 1)
        self.assertEqual(widget_json['image']['id'], 1)
        self.assertEqual(widget_json['description'], 'test description')
        self.assertEqual(widget_json['title'], 'test title')

    def test_widget_get_data(self):
        """Ensure that get_data returns the correct data"""

        article = DispatchTestHelpers.create_article(self.client)
        image = DispatchTestHelpers.create_image(self.client)

        widget = TestWidget()

        widget.set_data({
            'title': 'test title',
            'description': 'test description',
            'article': article.data['id'],
            'image' : image.data['id']
        })

        widget_data = widget.get_data()

        self.assertEqual(widget_data, {'article': 1, 'image': 1, 'description': 'test description', 'title': 'test title'})

    def test_widget_render(self):
        """Ensure that render will return correct html strings"""

        article = DispatchTestHelpers.create_article(self.client)
        image = DispatchTestHelpers.create_image(self.client)

        widget = TestWidget()

        widget.set_data({
            'title': 'test title',
            'description': 'test description',
            'article': article.data['id'],
            'image' : image.data['id']
        })

        widget_render = widget.render()

        html = u'<div class="widget">\n    <img class="title">test title</div>\n    <div class="description">test description</div>\n    <div class="article">Test headline</div>\n    <img class="image" src="%s"/>\n    \n</div>\n' % image.data['url']

        self.assertEqual(widget_render, html)

    def test_widget_render_no_data(self):
        """Rendering widgets with some of the data as None should not render the "None" data"""

        widget = TestWidget()

        result = widget.render()

        html = u'<div class="widget">\n    \n    \n    \n    \n    \n</div>\n'

        self.assertEqual(result, html)

    def test_widget_article_image_field_empty(self):
        """Article or image field should be filled"""

        widget = TestWidget()

        widget.set_data({
            'title': 'test title',
            'description': 'test description'
        })

        html = u'<div class="widget">\n    <img class="title">test title</div>\n    <div class="description">test description</div>\n    \n    \n    \n</div>\n'

        result = widget.render()
        self.assertEqual(result, html)

    def test_zone_render(self):
        """The test zone should be properly rendered"""

        register.zone(TestZone)
        register.widget(TestWidget)

        zone = TestZone()
        widget = TestWidget()

        validated_data = {
            'widget': 'test-widget',
            'data': {
              'title': 'test title 1',
              'description': 'test description'
            }
        }

        zone.save(validated_data)

        template = loader.get_template('widgets/zones.html')

        result = template.render()

        html = u'\n\n<div class="zone">\n<div class="widget">\n    <img class="title">test title 1</div>\n    <div class="description">test description</div>\n    \n    \n    \n</div>\n\n</div>\n'

        self.assertEqual(result, html)

    def test_context_method(self):
        """Context method should add the two events"""

        register.zone(TestZone)
        register.widget(TestEventWidget)

        zone = TestZone()
        widget = TestEventWidget()

        DispatchTestHelpers.create_event(self.client, title='event 1', start_time='2017-05-24T12:00', is_published=True)
        DispatchTestHelpers.create_event(self.client, title='event 2', start_time='2017-05-25T12:00', is_published=True)

        validated_data = {
            'widget': 'test-widget',
            'data': {
              'title': 'test title 1',
              'description': 'test description'
            }
        }

        zone.save(validated_data)
        widget.set_data(validated_data['data'])

        html = u'<div class="widget">\n    <img class="title">test title 1</div>\n    <div class="description">test description</div>\n    \n    \n    \n      <div class="events">event 2</div>\n    \n      <div class="events">event 1</div>\n    \n</div>\n'

        result = widget.render(widget.context(widget.prepare_data()))

        self.assertEqual(result, html)

    def test_original_context_method(self):
        """When not redefining context, it should just return the data unaffected"""

        register.zone(TestZone)
        register.widget(TestWidget)

        zone = TestZone()
        widget = TestWidget()

        validated_data = {
            'widget': 'test-widget',
            'data': {
              'title': 'test title 1',
              'description': 'test description'
            }
        }

        zone.save(validated_data)
        widget.set_data(validated_data['data'])

        html = u'<div class="widget">\n    <img class="title">test title 1</div>\n    <div class="description">test description</div>\n    \n    \n    \n</div>\n'

        data = widget.context(widget.prepare_data())
        result = widget.render(data)

        self.assertEqual(data, widget.prepare_data())
        self.assertEqual(result, html)

    def test_empty_zone_render(self):
        """Zone without widget attached should render empty"""

        register.zone(TestZone)

        zone = TestZone()

        validated_data = {
            'widget': None,
            'data': {}
        }

        zone.save(validated_data)

        template = loader.get_template('widgets/zones.html')

        result = template.render()

        html = u'\n\n<div class="zone">\n\n</div>\n'

        self.assertEqual(result,  html)

    def test_invalid_zone(self):

        template = loader.get_template('widgets/test-invalid-zone.html')

        result = template.render()

        html = u'\n\n<div class="zone">\n\n</div>\n'

        self.assertEqual(result, html)

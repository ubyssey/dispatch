from django.template import loader

from dispatch.theme import register
from dispatch.theme.widgets import Zone, Widget
from dispatch.theme.fields import CharField, TextField, ArticleField, ImageField, InvalidField
from dispatch.apps.content.models import Article, Image

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

        html = u'<div class="widget">\n    <img class="title">test title</div>\n    <div class="description">test description</div>\n    <div class="Article">Test headline</div>\n    <img class="image" src="%s"/>\n</div>\n' % image.data['url']

        self.assertEqual(widget_render, html)

    def test_widget_render_no_data(self):
        """Rendering widgets with some of the data as None should not render the "None" data"""

        widget = TestWidget()

        result = widget.render()

        html = u'<div class="widget">\n    \n    \n    \n    \n</div>\n'

        self.assertEqual(result, html)

    def test_widget_article_image_field_empty(self):
        """Article or image field should be filled"""

        widget = TestWidget()

        widget.set_data({
            'title': 'test title',
            'description': 'test description'
        })

        html = u'<div class="widget">\n    <img class="title">test title</div>\n    <div class="description">test description</div>\n    \n    \n</div>\n'

        result = widget.render()
        self.assertEqual(result, html)

    def test_zone_render(self):

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

        html = u'\n\n<div class="zone">\n<div class="widget">\n    <img class="title">test title 1</div>\n    <div class="description">test description</div>\n    \n    \n</div>\n\n</div>\n'

        self.assertEqual(result, html)


from dispatch.theme import register
from dispatch.theme.widgets import Zone, Widget
from dispatch.theme.fields import CharField, TextField, ArticleField, ImageField, InvalidField
from dispatch.apps.content.models import Article, Image

from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers

@register.zone
class TestZone(Zone):
    id = 'test-zone'
    name = 'Test zone'

@register.widget
class TestWidget(Widget):
    id = 'test-widget'
    name = 'Test widget'
    template = 'widgets/test-widget.html'

    zones = [TestZone]

    title = CharField('Title')
    description  = TextField('Description')
    article = ArticleField('Featured article')
    image = ImageField('Featured image')

class WidgetRenderTestCase(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_widget_to_json(self):
        """Ensure that to_json returns correct data"""

        article = DispatchTestHelpers.create_article(self.client)
        image_id = DispatchTestHelpers.upload_image(self.client)

        widget = TestWidget()

        widget.set_data({
            'title': 'test title',
            'description': 'test description',
            'article': article.data['id'],
            'image' : image_id
        })

        widget_json = widget.to_json()

        self.assertEqual(widget_json['article']['data']['id'], 1)
        self.assertEqual(widget_json['image']['data']['id'], 1)
        self.assertEqual(widget_json['description']['data'], 'test description')
        self.assertEqual(widget_json['title']['data'], 'test title')

    def test_widget_render(self):
        """Ensure that render will return correct html strings"""

        article = DispatchTestHelpers.create_article(self.client)
        image_id = DispatchTestHelpers.upload_image(self.client)

        widget = TestWidget()

        widget.set_data({
            'title': 'test title',
            'description': 'test description',
            'article': article.data['id'],
            'image' : image_id
        })

        widget_render = widget.render()

        html = u'<div class="widget">\n    <img class="title">test title</div>\n    <div class="description">test description</div>\n    <div class="Article">Test headline</div>\n    <img class="image" src="images/2017/05/test_image.png"/>\n</div>\n'

        self.assertEqual(widget_render, html)

    # Render widget that doesnt have data assigned
    def test_widget_render_no_data(self):
        """widget that renders with no data should throw error(?)"""

        article = DispatchTestHelpers.create_article(self.client)
        image_id = DispatchTestHelpers.upload_image(self.client)

        widget = TestWidget()

        data = widget.get_data(), '\n\n\n' # The data isnt being deleted between tests. Even
                                          # though "set_data" hasn't been called yet, the data
                                          # remains from the last call. Not sure how to change

        # ^^^ data gets {'article': 1, 'image': 1, 'description': 'test description', 'title': 'test title'}

        widget.set_data({
        })

        try:
            widget.render()
            self.fail('Render should have failed as data for initialized fields are required')
        except InvalidField:
            pass

    # article/image field empty
    def test_widget_article_image_field_empty(self):
        """Article or image field should be filled"""

        widget = TestWidget()

        widget.set_data({
            'title': 'test title',
            'description': 'test description'
        })

        try:
            widget.render()
            self.fail('Render should have failed as data for initialized fields are required')
        except InvalidField:
            pass

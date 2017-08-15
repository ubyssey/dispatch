from datetime import datetime

from dispatch.apps.content.models import Article, Image
from ubyssey.events.models import Event
from dispatch.theme import register
from dispatch.theme.fields import (
    CharField, TextField, ArticleField, ImageField,
    WidgetField, EventField, Field, DateTimeField,
    IntegerField, BoolField
)
from dispatch.theme.widgets import Zone, Widget
from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.theme.exceptions import InvalidField, WidgetNotFound

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
    widget = WidgetField('Featured Widget')

class TestWidget2(Widget):
    id = 'test-widget-2'
    name = 'Test widget 2'
    template = 'widgets/test-widget.html'

    zones = [TestZone]

    title = CharField('Title 2')
    description = TextField('Description 2')
    article = ArticleField('Featured article 2')
    image = ImageField('Featured image 2')
    widget = WidgetField('Featured Widget 2')

class TestWidget3(Widget):
    id = 'test-widget-3'
    name = 'Test widget 3'
    template = 'widgets/test-widget.html'

    zones = [TestZone]

    title = CharField('Title')

class WidgetFieldTest(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_char_field(self):
        """Should be able to initialize charfield and set data"""

        testfield = CharField('Title')

        data = 'This is a sentence'

        try:
            testfield.validate(data)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        self.assertEqual(testfield.to_json(data), 'This is a sentence')
        self.assertEqual(testfield.prepare_data(data), 'This is a sentence')

    def test_char_field_invalid_label(self):
        """Initilaizing with invalid data should raise an error"""

        try:
            testfield = CharField(6)
            self.fail('Setting CharField label to a number should raise InvalidField')
        except InvalidField:
            pass

    def test_char_field_invalid_data(self):
        """Setting CharField data to something to a number should raise InvalidField"""

        testfield = CharField('Title')

        try:
            testfield.validate(6)
            self.fail('Setting CharField data to a number should raise InvalidField')
        except InvalidField:
            pass

    def test_char_field_max_data_len(self):
        """Data must be equal to or below 255 charecters if max_len is not set to False"""

        testfield = CharField('Title')

        # 256 charecters
        data = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tempus metus et ultrices vehicula. Phasellus placerat, mi sed posuere elementum, nisl nisi condimentum odio, sit amet facilisis sem sapien et ligula. Phasellus vel sagittis mi. Morbi nullam.'

        try:
            testfield.validate(data)
            self.fail('Should fail with InvalidField')
        except InvalidField:
            pass

    def test_text_field(self):
        """Should be able to initialize charfield and set data"""

        testfield = TextField('Title')

        data = 'This is a longer sentence than the one further up\nthis file'

        try:
            testfield.validate(data)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        self.assertEqual(testfield.to_json(data), 'This is a longer sentence than the one further up\nthis file')
        self.assertEqual(testfield.prepare_data(data), 'This is a longer sentence than the one further up\nthis file')

    def test_text_field_invalid_data(self):
        """Setting TextField data to something to a number should raise InvalidField"""

        testfield = TextField('Title')

        try:
            testfield.validate(6)
            self.fail('Setting TextField data to a number should raise InvalidField')
        except InvalidField:
            pass

    def test_article_field(self):
        """Should be able to create article Field"""

        testfield = ArticleField('Title', many=True)

        article_1 = DispatchTestHelpers.create_article(self.client, headline='Test headline 1', slug='test-article-1')
        article_2 = DispatchTestHelpers.create_article(self.client, headline='Test headline 2', slug='test-article-2')

        data = [article_1.data['id'], article_2.data['id']]

        try:
            testfield.validate(data)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        json = testfield.to_json(data)

        # Test some example entries
        self.assertEqual(json[0]['id'], 1)
        self.assertEqual(json[1]['id'], 2)
        self.assertEqual(json[0]['headline'], u'Test headline 1')
        self.assertEqual(json[1]['headline'], u'Test headline 2')

    def test_article_single_id(self):
        """Should be able to create article field with only 1 id"""

        testfield = ArticleField('Title')

        article = DispatchTestHelpers.create_article(self.client)

        data = article.data['id']

        try:
            testfield.validate(data)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        json = testfield.to_json(data)

        # Test some example entries
        self.assertEqual(json['id'], 1)
        self.assertEqual(json['headline'], u'Test headline')

    def test_article_prepare_data(self):
        """Should be able to return prepared data for the template"""

        testfield = ArticleField('Title', many=True)

        article_1 = DispatchTestHelpers.create_article(self.client, headline='Test headline 1', slug='test-article-1')
        article_2 = DispatchTestHelpers.create_article(self.client, headline='Test headline 2', slug='test-article-2')

        data = [article_1.data['id'], article_2.data['id']]

        try:
            testfield.validate(data)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        result = testfield.prepare_data(data)

        self.assertEqual(result[0].title, article_1.data['headline'])
        self.assertEqual(result[1].title, article_2.data['headline'])

    def test_article_false_many(self):
        """Test the case where many is false when you have more than 1 article"""

        testfield = ArticleField('Title')

        article_1 = DispatchTestHelpers.create_article(self.client, headline='Test headline 1', slug='test-article-1')
        article_2 = DispatchTestHelpers.create_article(self.client, headline='Test headline 2', slug='test-article-2')

        data = [article_1.data['id'], article_2.data['id']]

        try:
            testfield.validate(data)
            self.fail('Field data is invalid, exception should have been thrown')
        except InvalidField:
            pass

    def test_article_singular_data(self):
        """Test the case where ArticleField is initialized with many, but given 1 piece of data"""

        testfield = ArticleField('Title', many=True)

        article_1 = DispatchTestHelpers.create_article(self.client, headline='Test headline 1', slug='test-article-1')

        data = article_1.data['id']

        try:
            testfield.validate(data)
            self.fail('Field data is invalid, exception should have been thrown')
        except InvalidField:
            pass

    def test_article_doesnt_exist(self):
        """Test the case where an article id for an article that doesn't exist is passed as data"""

        testfield = ArticleField('Title')

        id = -1

        try:
            testfield.get_model(id)
            self.fail('Field data is invalid, exception should have been thrown')
        except Article.DoesNotExist:
            pass

    def test_article_to_json_no_data(self):
        """Passing data=None to to_json returns None"""

        testfield = ArticleField('Title')

        data = None

        self.assertEqual(testfield.to_json(data), None)

        testfield = ArticleField('Title', many=True)

        data = None

        self.assertEqual(testfield.to_json(data), [])

    def test_image_field(self):
        """Should be able to create image field"""

        testfield = ImageField('Title', many=True)

        image_1 = DispatchTestHelpers.create_image(self.client)
        image_2 = DispatchTestHelpers.create_image(self.client)

        data = [image_1.data['id'], image_2.data['id']]

        try:
            testfield.validate(data)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        json = testfield.to_json(data)

        image_1 = Image.objects.get(pk=image_1.data['id'])
        image_2 = Image.objects.get(pk=image_2.data['id'])

        self.assertEqual(json[0]['id'], 1)
        self.assertEqual(json[0]['filename'], image_1.filename())
        self.assertEqual(json[1]['id'], 2)
        self.assertEqual(json[1]['filename'], image_2.filename())


    def test_image_single_id(self):
        """Should be able to create image field with only 1 id"""

        testfield = ImageField('Title')

        image = DispatchTestHelpers.create_image(self.client)

        try:
            testfield.validate(image.data['id'])
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        json = testfield.to_json(image.data['id'])

        image = Image.objects.get(pk=image.data['id'])

        self.assertEqual(json['id'], 1)
        self.assertEqual(json['filename'], image.filename())

    def test_image_prepare_data(self):
        """Should be able to return prepared data for the template"""

        testfield = ImageField('Title', many=True)

        image_1 = DispatchTestHelpers.create_image(self.client)
        image_2 = DispatchTestHelpers.create_image(self.client)

        data = [image_1.data['id'], image_2.data['id']]

        try:
            testfield.validate(data)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        image_1 = Image.objects.get(pk=image_1.data['id'])
        image_2 = Image.objects.get(pk=image_2.data['id'])

        result = testfield.prepare_data(data)

        self.assertEqual(result[0].filename(), image_1.filename())
        self.assertEqual(result[1].filename(), image_2.filename())

    def test_image_false_many(self):
        """Test the case where many is false where you have more than 1 image"""

        testfield = ImageField('Title')

        image_1 = DispatchTestHelpers.create_image(self.client)
        image_2 = DispatchTestHelpers.create_image(self.client)

        data = [image_1.data['id'], image_2.data['id']]

        try:
            testfield.validate(data)
            self.fail('Field data is invalid, exception should have been thrown')
        except:
            pass

    def test_not_implemented_validate_method(self):
        """Tests that not writing a validate method for a new field raises an error"""

        testfield = Field('Test Label')

        data = 'Test Data'

        try:
            testfield.validate(data)
            self.fail('Code should have failed with NotImplementedError')
        except NotImplementedError:
            pass

    def test_image_singular_data(self):
        """Test the case where ImageField is initialized with many, but given 1 piece of data"""

        testfield = ImageField('Title', many=True)

        image = DispatchTestHelpers.create_image(self.client)

        try:
            testfield.validate(image.data['id'])
            self.fail('Field data is invalid, exception should have been thrown')
        except InvalidField:
            pass

    def test_image_doesnt_exist(self):
        """Test the case where an image id is passed for an image that doesnt exist"""

        testfield = ImageField('Title')

        id = 1

        try:
            testfield.get_model(id)
        except Image.DoesNotExist:
            pass

    def test_image_to_json_no_data(self):
        """Test the case where None data is passed to 'to_json' """

        testfield = ImageField('Title')

        data = None

        self.assertEqual(testfield.to_json(data), None)

    def test_widget_field_initialization(self):
        """Should be able to initialize a new WidgetField"""

        register.widget(TestWidget)

        # Create article and image for testing
        article = DispatchTestHelpers.create_article(self.client)
        image = DispatchTestHelpers.create_image(self.client)

        testwidget = TestWidget()

        field_data = {
            'id': 'test-widget',
            'data': {
                'title': 'test title',
                'description': 'test description',
                'article': article.data['id'],
                'image': image.data['id']
            }
        }

        # a test Widget is now initialized, initilize a widget field to put the test Widget in
        testfield = WidgetField('Title')

        try:
            testfield.validate(field_data['id'])
        except InvalidField:
            self.fail('Widget should be valid')

    def test_get_widget_from_widget_field(self):
        """Should be able to validate and get widget from widgetfield"""

        register.widget(TestWidget)

        testwidget = TestWidget()

        testfield = WidgetField('Title')

        # Create article and image for testing
        article = DispatchTestHelpers.create_article(self.client)
        image = DispatchTestHelpers.create_image(self.client)

        field_data = {
            'id': testwidget.id,
            'data': {
                'title': 'test title',
                'description': 'test description',
                'article': article.data['id'],
                'image': image.data['id']
            }
        }

        widget = testfield.get_widget(field_data['id'])

        self.assertEqual(type(widget), type(testwidget))

    def test_widget_field_invalid_data(self):
        """Trying to validate invalid data should result in InvalidField error"""

        testfield = WidgetField('Title')

        # The data to be validated - valid data are basestrings
        widget_id = 1

        try:
            testfield.validate(widget_id)
            self.fail('Widget ID was invalid - validate method should have raised Invalid Field')
        except InvalidField:
            pass

    def test_widget_field_to_json(self):
        """Should be able to get to_json from field"""

        register.widget(TestWidget)

        # Create article and image for testing
        article = DispatchTestHelpers.create_article(self.client)
        image = DispatchTestHelpers.create_image(self.client)

        testfield = WidgetField('Title')

        field_data = {
            'id': 'test-widget',
            'data': {
                'title': 'test title',
                'description': 'test description',
                'article': article.data['id'],
                'image': image.data['id']
            }
        }

        json = testfield.to_json(field_data)

        self.assertEqual(json['id'], 'test-widget')

    def test_widget_field_prepare_data(self):
        """Prepare_data should return widget"""

        register.widget(TestWidget)

        # Create article and image for testing
        article = DispatchTestHelpers.create_article(self.client)
        image = DispatchTestHelpers.create_image(self.client)
        widget = TestWidget()

        testfield = WidgetField('Title')

        field_data = {
            'id': 'test-widget',
            'data': {
                'title': 'test title',
                'description': 'test description',
                'article': article.data['id'],
                'image': image.data['id']
            }
        }

        prepared_data = testfield.prepare_data(field_data)

        self.assertEqual(type(prepared_data), type(widget))

    def test_get_all_widgets(self):
        """Get all the widgets associated with a field"""

        register.widget(TestWidget)
        register.widget(TestWidget2)
        register.widget(TestWidget3)

        # Create article and image for testing
        article = DispatchTestHelpers.create_article(self.client)
        image = DispatchTestHelpers.create_image(self.client)
        widget1 = TestWidget()
        widget2 = TestWidget2()
        widget3 = TestWidget3()

        testfield = WidgetField('Title')

        field_data = {
            'id': 'test-widget',
            'data': {
                'title': 'test title',
                'description': 'test description',
                'article': article.data['id'],
                'image': image.data['id'],
                'widget': {
                    'id': 'test-widget-2',
                    'data': {
                        'title': 'test title',
                        'description': 'test description',
                        'article': article.data['id'],
                        'image': image.data['id'],
                        'widget': {
                            'id': 'test-widget-3',
                            'data': {
                                'title': 'Test widget 3'
                            }
                        }
                    }
                }
            }
        }

        json = testfield.to_json(field_data)
        prepared_data = testfield.prepare_data(field_data).data

        self.assertEqual(json['id'], 'test-widget')
        self.assertEqual(json['data']['widget']['id'], 'test-widget-2')
        self.assertEqual(json['data']['widget']['data']['widget']['id'], 'test-widget-3')

        self.assertEqual(prepared_data['widget']['id'], 'test-widget-2')
        self.assertEqual(prepared_data['widget']['data']['widget']['id'], 'test-widget-3')

    def test_widget_field_invalid_data(self):
        """Initilaizing a widget field with invalid data should raise an error"""

        try:
            widget = WidgetField(6)
            self.fail('InvalidField Error should have been raised')
        except InvalidField:
            pass

    def test_get_non_existant_widget(self):
        """Using get_widget with non-existant widget_id should fail"""

        widget = WidgetField('Title')

        try:
            widget.get_widget('this_is_not_a_widget_id')
            self.fail('WidgetNotFound Error should have been raised')
        except WidgetNotFound:
            pass

    def test_widget_to_json_no_data(self):
        """Using to_json with no data should return None for data"""

        data = None
        widget = WidgetField('Title')

        self.assertEqual(widget.to_json(data), None)

    def test_event_field(self):
        """Should be able to create event Field"""

        testfield = EventField('Title', many=True)

        event_1 = DispatchTestHelpers.create_event(self.client, title='Test title 1')
        event_2 = DispatchTestHelpers.create_event(self.client, title='Test title 2')

        data = [event_1.data['id'], event_2.data['id']]

        try:
            testfield.validate(data)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        json = testfield.to_json(data)

        # Test some example entries
        self.assertEqual(json[0]['id'], 1)
        self.assertEqual(json[1]['id'], 2)
        self.assertEqual(json[0]['title'], u'Test title 1')
        self.assertEqual(json[1]['title'], u'Test title 2')

    def test_event_single_id(self):
        """Should be able to create event field with only 1 id"""

        testfield = EventField('Title')

        event = DispatchTestHelpers.create_event(self.client)

        data = event.data['id']

        try:
            testfield.validate(data)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        json = testfield.to_json(data)

        # Test some example entries
        self.assertEqual(json['id'], 1)
        self.assertEqual(json['title'], u'Test event')

    def test_event_prepare_data(self):
        """Should be able to return prepared data for the template"""

        testfield = EventField('Title', many=True)

        event_1 = DispatchTestHelpers.create_event(self.client, title='Test title 1', description='test description 1')
        event_2 = DispatchTestHelpers.create_event(self.client, title='Test title 2', description='test description 2')

        data = [event_1.data['id'], event_2.data['id']]

        try:
            testfield.validate(data)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        result = testfield.prepare_data(data)

        self.assertEqual(result[0].title, event_1.data['title'])
        self.assertEqual(result[1].title, event_2.data['title'])

    def test_event_false_many(self):
        """Test the case where many is false when you have more than 1 event"""

        testfield = EventField('Title')

        event_1 = DispatchTestHelpers.create_event(self.client, title='Test title 1', description='test description')
        event_2 = DispatchTestHelpers.create_event(self.client, title='Test title 2', description='test description')

        data = [event_1.data['id'], event_2.data['id']]

        try:
            testfield.validate(data)
            self.fail('Field data is invalid, exception should have been thrown')
        except InvalidField:
            pass

    def test_event_singular_data(self):
        """Test the case where EventField is initialized with many, but given 1 piece of data"""

        testfield = EventField('Title', many=True)

        event_1 = DispatchTestHelpers.create_event(self.client, title='Test title 1', description='test description')

        data = event_1.data['id']

        try:
            testfield.validate(data)
            self.fail('Field data is invalid, exception should have been thrown')
        except InvalidField:
            pass

    def test_event_doesnt_exist(self):
        """Test the case where an event id for an event that doesn't exist is passed as data"""

        testfield = EventField('Title')

        id = -1

        try:
            testfield.get_model(id)
            self.fail('Field data is invalid, exception should have been thrown')
        except Event.DoesNotExist:
            pass

    def test_event_to_json_no_data(self):
        """Passing data=None to to_json returns None"""

        testfield = EventField('Title')

        data = None

        self.assertEqual(testfield.to_json(data), None)

    def test_datetimefield(self):
        """DateTimeField should correctly parse at least ISO format"""
        testfield = DateTimeField('Test')

        date = datetime.today()
        date_sz = date.isoformat()

        testfield.validate(date_sz)

        self.assertEqual(testfield.prepare_data(date_sz), date)

    def test_datetimefield_invalid_data(self):
        """DateTimeField should throw InvalidField when it is given an unparsable string"""
        testfield = DateTimeField('Test')
        date_sz = 'garbage'

        try:
            testfield.validate(date_sz)
            self.fail('Field date is invalid, exception should have been thrown')
        except InvalidField:
            pass

    def test_intfield(self):
        """IntegerField should correctly parse integer strings"""
        testfield = IntegerField('Test')

        def value_test(value):
            value_sz = str(value)

            testfield.validate(value_sz)

            self.assertEqual(value, testfield.prepare_data(value_sz))

        value_test(-7418529)
        value_test(0)
        value_test(4573495)

    def test_intfield_invalid_data(self):
        """IntegerField should throw InvalidField when given a string that
            can not be parsed into an int"""
        testfield = IntegerField('Test')

        def validate_test(input):
            with self.assertRaises(InvalidField):
                testfield.validate(input)

        validate_test('1234.56789')
        validate_test('text')

    def test_intfield_bounds(self):
        """IntegerField should throw InvalidField when given a string that parses
            into a value outside the bounds defined by min_value and max_value"""

        # test the bounds sanity check
        with self.assertRaises(InvalidField):
            testfield = IntegerField('Test', min_value=1, max_value=0)

        testfield = IntegerField('Test', min_value=0, max_value=100)
        with self.assertRaises(InvalidField):
            testfield.validate('101')
            testfield.validate('-1')

    def test_boolfield(self):
        """Ensure that BoolField stores the value correctly"""

        testfield = BoolField('Test')

        testfield.validate(True)
        self.assertEqual(True, testfield.prepare_data(True))

        testfield.validate(False)
        self.assertEqual(False, testfield.prepare_data(False))

    def test_boolfield_invalid_data(self):
        """Ensure that BoolField correctly rejects invalid data"""

        testfield = BoolField('Test')

        def test_value(value):
            with self.assertRaises(InvalidField):
                testfield.validate(value)

        test_value(1)
        test_value('True')
        test_value({})

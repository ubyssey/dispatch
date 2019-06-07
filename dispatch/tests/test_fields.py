from datetime import datetime

from dispatch.models import Article, Image
from dispatch.theme import register
from dispatch.theme.fields import (
    CharField, TextField, ArticleField, ImageField,
    ModelField, WidgetField, Field, DateTimeField,
    IntegerField, BoolField, SelectField
)
from django.db import NotSupportedError
from dispatch.theme.widgets import Zone, Widget
from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.theme.exceptions import InvalidField, WidgetNotFound

class TestZone(Zone):
     id = 'test-zone'
     name = 'Test zone'

class TestWidgetSub(Widget):
    id = 'test-widget-sub'
    name = 'Test Widget Sub'
    template = 'widgets/test-widget.html'

    title = CharField('title')

class TestWidget(Widget):
    id = 'test-widget'
    name = 'Test widget'
    template = 'widgets/test-widget.html'

    zones = [TestZone]

    title = CharField('Title')
    description = TextField('Description')
    article = ArticleField('Featured article')
    image = ImageField('Featured image')
    widget = WidgetField('Featured Widget', [TestWidgetSub])

class TestWidget2(Widget):
    id = 'test-widget-2'
    name = 'Test widget 2'
    template = 'widgets/test-widget.html'

    zones = [TestZone]

    title = CharField('Title 2')
    description = TextField('Description 2')
    article = ArticleField('Featured article 2')
    image = ImageField('Featured image 2')
    widget = WidgetField('Featured Widget 2', [TestWidgetSub])

class TestWidget3(Widget):
    id = 'test-widget-3'
    name = 'Test widget 3'
    template = 'widgets/test-widget.html'

    zones = [TestZone]

    title = CharField('Title')

class TestWidgetR(Widget):
    id = 'test-widget-r'
    name = 'Test Widget R'
    template = 'widget/test-widget.html'

    zones = [TestZone]

    title = CharField('Title', required=True)
    description = TextField('Description', required=True)
    article = ArticleField('Featured article', required=True)
    image = ImageField('Featured image', required=True)
    widget = WidgetField('Featured Widget', [TestWidgetSub], required=True)

class FieldTests(DispatchAPITestCase, DispatchMediaTestMixin):

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

    def test_select_field(self):
        """Should be able to initialize select field and set data"""

        TEST_OPTIONS = [
            ['1', 'Option 1'],
            ['2', 'Option 2']
        ]

        testfield = SelectField('Test', options=TEST_OPTIONS)

        try:
            testfield.validate('2')
        except InvalidField:
            self.fail('"2" is a valid option for this field')

        try:
            testfield.validate('3')
            self.fail('"3" is not a valid option for this field, exception expected')
        except InvalidField:
            pass

    def test_select_field_required(self):
        """Required select fields should not accept empty values"""

        TEST_OPTIONS = [
            ['1', 'Option 1'],
            ['2', 'Option 2']
        ]

        testfield = SelectField('Test', options=TEST_OPTIONS, required=True)

        try:
            testfield.validate('')
            self.fail('Empty string is not a valid option for this field, exception expected')
        except InvalidField:
            pass

    def test_select_field_optional(self):
        """Optional select field should accept empty values"""

        TEST_OPTIONS = [
            ['1', 'Option 1'],
            ['2', 'Option 2']
        ]

        testfield = SelectField('Test', options=TEST_OPTIONS, required=False)

        try:
            testfield.validate('')
        except InvalidField:
            self.fail('Empty values are valid for optional select fields')

        try:
            testfield.validate(None)
        except InvalidField:
            self.fail('Empty values are valid for optional select fields')

    def test_select_field_empty(self):
        """Empty select fields cannot be required fields"""

        try:
            testfield = SelectField('Test', options=[], required=True)
            self.fail('Empty select fields cannot be required fields')
        except InvalidField:
            pass

    def test_model_field_valid(self):
        """Model field should allow valid ids"""

        testfield = ModelField('Title')

        try:
            testfield.validate(45)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        try:
            testfield.validate('4ea81b8f-1b7b-4d1f-afd8-bcbd281ee497')
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        testfield = ModelField('Title', many=True)

        try:
            testfield.validate([35, 45])
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        try:
            testfield.validate(['4ea81b8f-1b7b-4d1f-afd8-bcbd281ee497', '4ea81b8f-1b7b-4d1f-afd8-bcbd281ee497'])
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

    def test_model_field_invalid(self):
        """Model field should not allow invalid ids"""

        testfield = ModelField('Title')

        try:
            testfield.validate('asdf')
            self.fail('Field data is invalid, exception should have been thrown')
        except InvalidField:
            pass

        try:
            testfield.validate('')
            self.fail('Field data is invalid, exception should have been thrown')
        except InvalidField:
            pass

        testfield = ModelField('Title', many=True)

        try:
            testfield.validate(['a', 'b', 'c'])
            self.fail('Field data is invalid, exception should have been thrown')
        except InvalidField:
            pass

        try:
            testfield.validate(5)
            self.fail('Field data is invalid, exception should have been thrown')
        except InvalidField:
            pass

    def test_article_field(self):
        """Should be able to create article field"""

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
        self.assertEqual(json[0]['headline'], 'Test headline 1')
        self.assertEqual(json[1]['headline'], 'Test headline 2')

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
        self.assertEqual(json['headline'], 'Test headline')

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
            testfield.get_single(id)
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
        self.assertEqual(json[0]['filename'], image_1.get_filename())
        self.assertEqual(json[1]['id'], 2)
        self.assertEqual(json[1]['filename'], image_2.get_filename())


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
        self.assertEqual(json['filename'], image.get_filename())

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

        self.assertEqual(result[0].get_filename(), image_1.get_filename())
        self.assertEqual(result[1].get_filename(), image_2.get_filename())

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
            self.fail('Code should have failed with NotSupportedError')
        except NotSupportedError:
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
            testfield.get_single(id)
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
        testfield = WidgetField('Title', [TestWidgetSub])

        try:
            testfield.validate(field_data)
        except InvalidField:
            self.fail('Widget should be valid')

    def test_get_widget_from_widget_field(self):
        """Should be able to validate and get widget from widgetfield"""

        register.widget(TestWidget)

        testwidget = TestWidget()

        testfield = WidgetField('Title', [TestWidgetSub])

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

    def test_get_widget_from_widget_field_no_id(self):
        """Test the case where None id is passed to 'get_widget' """

        register.widget(TestWidget)
        
        testwidget = TestWidget()

        testfield = WidgetField('Title', [TestWidgetSub])

        field_data = {
            'id': None
        }

        widget = testfield.get_widget(field_data['id'])

        self.assertEqual(widget, None)

    def test_get_widget_json_no_widget(self):
        """Test the case where None widget is passed to 'get_widget_json' """
        register.widget(TestWidget)
        
        testwidget = TestWidget()

        testfield = WidgetField('Title', [TestWidgetSub])

        field_data = {
            'id': None
        }

        widget = testfield.get_widget_json(field_data)

        self.assertEqual(widget, None)

    def test_validate_widget_field_no_id(self):
        """Trying to validate invalid data (no id) should result in InvalidField error"""

        testfield = WidgetField('Title', [TestWidgetSub])

        # The data to be validated - valid data are basestrings
        field_data = {
            'id': '',
            'data': {
                'title': 'test title',
                'description': 'test description',
            }
        }

        try:
            testfield.validate(field_data)
            self.fail('Widget ID was invalid - validate method should have raised Invalid Field')
        except InvalidField:
            pass

    def test_validate_widget_field_required_no_data(self):
        """Trying to validate invalid data (no data) should result in InvalidField error"""

        testfield = WidgetField('Title', [TestWidgetSub], required=True)

        # The data to be validated - valid data are basestrings
        field_data = ''

        try:
            testfield.validate(field_data)
            self.fail('Widget data was invalid - validate method should have raised Invalid Field')
        except InvalidField:
            pass

    def test_widget_field_to_json(self):
        """Should be able to get to_json from field"""

        register.widget(TestWidget)

        # Create article and image for testing
        article = DispatchTestHelpers.create_article(self.client)
        image = DispatchTestHelpers.create_image(self.client)

        testfield = WidgetField('Title', [TestWidgetSub])

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

        testfield = WidgetField('Title', [TestWidgetSub])

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

    def test_widget_field_prepare_data_no_data(self):
        """Test the case where None data is passed to 'prepare_data' """

        widget = WidgetField('Title', [TestWidgetSub])

        data = None

        self.assertEqual(widget.prepare_data(data), None)

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

        testfield = WidgetField('Title', [TestWidgetSub])

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
            widget = WidgetField(6, [TestWidgetSub])
            self.fail('InvalidField Error should have been raised')
        except InvalidField:
            pass

    def test_get_non_existant_widget(self):
        """Using get_widget with non-existant widget_id should fail"""

        widget = WidgetField('Title', [TestWidgetSub])

        try:
            widget.get_widget('this_is_not_a_widget_id')
            self.fail('WidgetNotFound Error should have been raised')
        except WidgetNotFound:
            pass

    def test_widget_to_json_no_data(self):
        """Using to_json with no data should return None for data"""

        data = None
        widget = WidgetField('Title', [TestWidgetSub])

        self.assertEqual(widget.to_json(data), None)

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

            self.assertEqual(testfield.prepare_data(value_sz), value)

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
        with self.assertRaises(InvalidField):
            testfield.validate('-1')

    def test_boolfield(self):
        """Ensure that BoolField stores the value correctly"""

        testfield = BoolField('Test')

        testfield.validate(True)
        self.assertEqual(testfield.prepare_data(True), True)

        testfield.validate(False)
        self.assertEqual(testfield.prepare_data(False), False)

    def test_boolfield_invalid_data(self):
        """Ensure that BoolField correctly rejects invalid data"""

        testfield = BoolField('Test')

        def test_value(value):
            with self.assertRaises(InvalidField):
                testfield.validate(value)

        test_value(1)
        test_value('True')
        test_value({})

    def test_fields_required(self):
        """Test fields with the required prop and ensure they validate"""

        testfield = CharField('Test', required=True)
        testfield.validate('test')
        self.assertEqual(testfield.prepare_data('test'), 'test')

        testfield = TextField('Test', required=True)
        testfield.validate('test')
        self.assertEqual(testfield.prepare_data('test'), 'test')

        testfield = DateTimeField('Test', required=True)
        date = datetime.today()
        date_sz = date.isoformat()
        testfield.validate(date_sz)
        self.assertEqual(testfield.prepare_data(date_sz), date)

        testfield = IntegerField('Test', required=True)
        testfield.validate('5')
        self.assertEqual(testfield.prepare_data('5'), 5)

    def test_fields_notrequired_empty(self):
        """Not required fields should accept empty values"""

        testfield = CharField('Test')
        testfield.validate('')
        self.assertEqual(testfield.prepare_data(''), '')

        testfield = TextField('Test')
        testfield.validate('')
        self.assertEqual(testfield.prepare_data(''), '')

        testfield = DateTimeField('Test')
        testfield.validate('')
        self.assertEqual(testfield.prepare_data(''), None)

        testfield = IntegerField('Test')
        testfield.validate('')
        self.assertEqual(testfield.prepare_data(''), None)


    def test_fields_required_empty(self):
        """Test fields with the required prop and ensure they raise an error
        when given empty data
        """

        testfield = CharField('Test', required=True)
        with self.assertRaises(InvalidField):
            testfield.validate(None)
        with self.assertRaises(InvalidField):
            testfield.validate('')

        testfield = TextField('Test', required=True)
        with self.assertRaises(InvalidField):
            testfield.validate(None)
        with self.assertRaises(InvalidField):
            testfield.validate('')

        testfield = DateTimeField('Test', required=True)
        with self.assertRaises(InvalidField):
            testfield.validate(None)
        with self.assertRaises(InvalidField):
            testfield.validate('')

        testfield = IntegerField('Test', required=True)
        with self.assertRaises(InvalidField):
            testfield.validate(None)
        with self.assertRaises(InvalidField):
            testfield.validate('')
from dispatch.apps.content.models import Article, Image
from dispatch.theme import register
from dispatch.theme.fields import CharField, TextField, ArticleField, ImageField, WidgetField, Field
from dispatch.theme.widgets import Zone, Widget
from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.theme.exceptions import InvalidField

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

class WidgetFieldTest(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_char_field(self):
        """Should be able to initialize charfield and set data"""

        testfield = CharField('Title')

        data = 'This is a sentence'

        try:
            testfield.validate(data)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        self.assertEqual(testfield.to_json(data), {'label' : 'Title', 'data': 'This is a sentence'})
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

        self.assertEqual(testfield.to_json(data)['data'], 'This is a longer sentence than the one further up\nthis file')
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
        self.assertEqual(json['label'], 'Title')
        self.assertEqual(json['data'][0]['id'], 1)
        self.assertEqual(json['data'][1]['id'], 2)
        self.assertEqual(json['data'][0]['headline'], u'Test headline 1')
        self.assertEqual(json['data'][1]['headline'], u'Test headline 2')

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
        self.assertEqual(json['label'], 'Title')
        self.assertEqual(json['data']['id'], 1)
        self.assertEqual(json['data']['headline'], u'Test headline')

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
        """Test the case where many is false where you have more than 1 article"""

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
            testfield.get_article(id)
            self.fail('Field data is invalid, exception should have been thrown')
        except Article.DoesNotExist:
            pass

    def test_article_to_json_no_data(self):
        """Passing data=None to to_json returns None"""

        testfield = ArticleField('Title')

        data = None

        self.assertEqual(testfield.to_json(data), {'label' : 'Title', 'data' : None})


    def test_image_field(self):
        """Should be able to create image field"""

        testfield = ImageField('Title', many=True)

        image_id_1 = DispatchTestHelpers.upload_image(self.client)
        image_id_2 = DispatchTestHelpers.upload_image(self.client)

        data = [image_id_1, image_id_2]

        try:
            testfield.validate(data)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        json = testfield.to_json(data)

        image_1 = Image.objects.get(pk=image_id_1)
        image_2 = Image.objects.get(pk=image_id_2)

        self.assertEqual(json['label'], 'Title')
        self.assertEqual(json['data'][0]['id'], 1)
        self.assertEqual(json['data'][0]['filename'], image_1.filename())
        self.assertEqual(json['data'][1]['id'], 2)
        self.assertEqual(json['data'][1]['filename'], image_2.filename())


    def test_image_single_id(self):
        """Should be able to create image field with only 1 id"""

        testfield = ImageField('Title')

        image_id = DispatchTestHelpers.upload_image(self.client)

        try:
            testfield.validate(image_id)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        json = testfield.to_json(image_id)

        image = Image.objects.get(pk=image_id)

        # Test some example entries
        self.assertEqual(json['label'], 'Title')
        self.assertEqual(json['data']['id'], 1)
        self.assertEqual(json['data']['filename'], image.filename())

    def test_image_prepare_data(self):
        """Should be able to return prepared data for the template"""

        testfield = ImageField('Title', many=True)

        image_id_1 = DispatchTestHelpers.upload_image(self.client)
        image_id_2 = DispatchTestHelpers.upload_image(self.client)

        data = [image_id_1, image_id_2]

        try:
            testfield.validate(data)
        except InvalidField:
            self.fail('Field data is valid, exception should not have been thrown')

        image_1 = Image.objects.get(pk=image_id_1)
        image_2 = Image.objects.get(pk=image_id_2)

        result = testfield.prepare_data(data)

        self.assertEqual(result[0].filename(), image_1.filename())
        self.assertEqual(result[1].filename(), image_2.filename())

    def test_image_false_many(self):
        """Test the case where many is false where you have more than 1 image"""

        testfield = ImageField('Title')

        image_id_1 = DispatchTestHelpers.upload_image(self.client)
        image_id_2 = DispatchTestHelpers.upload_image(self.client)

        data = [image_id_1, image_id_2]

        try:
            testfield.validate(data)
            self.fail('Field data is invalid, exception should have been thrown')
        except:
            pass

    def test_not_implemented_validated_method(self):
        """Tests that not writing a validate method for a new field raises an error"""

        testfield = Field('Test Label')

        data = 'Test Data'

        try:
            testfield.validate(data)
            self.fail('Code should have failed with NotImplementedError')
        except NotImplementedError:
            pass

    def test_image_singular_data(self):
        """Test the case where ArticleField is initialized with many, but given 1 piece of data"""

        testfield = ImageField('Title', many=True)

        image_id_1 = DispatchTestHelpers.upload_image(self.client)

        data = image_id_1

        try:
            testfield.validate(data)
            self.fail('Field data is invalid, exception should have been thrown')
        except InvalidField:
            pass

    def test_image_doesnt_exist(self):
        """Test the case where an image id is passed for an image that doesnt exist"""

        testfield = ImageField('Title')

        id = 1

        try:
            testfield.get_image(id)
        except Image.DoesNotExist:
            pass

    def test_image_none_data_to_json(self):
        """Test the case where None data is passed to 'to_json' """

        testfield = ImageField('Title')

        data = None

        self.assertEqual(testfield.to_json(data), {'label' : 'Title', 'data' : None})

    def test_widget_field_initialization(self):
        """Should be able to initialize a new WidgetField"""

        # Create article and image for testing
        article = DispatchTestHelpers.create_article(self.client)
        image_id = DispatchTestHelpers.upload_image(self.client)

        testwidget = TestWidget()

        testwidget.set_data({
            'title': 'test title',
            'description': 'test description',
            'article': article.data['id'],
            'image' : image_id
        })

        registery = register.widget(testwidget) # Test Widget is now registered

        print registery

        widget_id = testwidget.id

        # a test Widget is now initialized, initilize a widget field to put the test Widget in
        testfield = WidgetField('Title')

        try:
            testfield.validate(widget_id)
        except InvalidField:
            raise InvalidField('Widget with id %s does not exist' % widget_id)

        json = testfield.get_widget(widget_id)
        print json

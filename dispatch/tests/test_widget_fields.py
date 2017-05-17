from dispatch.apps.content.models import Image
from dispatch.theme.fields import CharField, TextField, ArticleField, ImageField, InvalidField
from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers

class WidgetFieldTest(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_char_field(self):
        """Should be able to initialize charfield and set data"""

        testfield = CharField('Title')
        testfield.set_data("This is a sentence")

        try:
            testfield.validate()
        except InvalidField:
            self.fail("Field data is valid, exception should not have been thrown")

        self.assertEqual(testfield.to_json(), 'This is a sentence')
        self.assertEqual(testfield.prepare_data(), 'This is a sentence')

    def test_char_field_invalid_label(self):
        """Initilaizing with invalid data should raise an error"""

        try:
            testfield = CharField(6)
            self.fail("Setting CharField label to a number should raise InvalidField")
        except InvalidField:
            pass

    def test_char_field_invalid_data(self):
        """Setting CharField data to something to a number should raise InvalidField"""

        testfield = CharField('Title')
        testfield.set_data(6)

        try:
            testfield.validate()
            self.fail("Setting CharField data to a number should raise InvalidField")
        except InvalidField:
            pass

    def test_char_field_max_data_len(self):
        """Data must be equal to or below 255 charecters if max_len is not set to False"""

        testfield = CharField('Title')

        # 256 charecters
        data = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tempus metus et ultrices vehicula. Phasellus placerat, mi sed posuere elementum, nisl nisi condimentum odio, sit amet facilisis sem sapien et ligula. Phasellus vel sagittis mi. Morbi nullam.'

        testfield.set_data(data)

        try:
            testfield.validate()
            self.fail("Should fail with InvalidField")
        except InvalidField:
            pass

    def test_text_field(self):
        """Should be able to initialize charfield and set data"""

        testfield = TextField('Title')
        testfield.set_data('This is a longer sentence than the one further up\nthis file')

        try:
            testfield.validate()
        except InvalidField:
            self.fail("Field data is valid, exception should not have been thrown")

        self.assertEqual(testfield.to_json(), 'This is a longer sentence than the one further up\nthis file')
        self.assertEqual(testfield.prepare_data(), 'This is a longer sentence than the one further up\nthis file')

    def test_text_field_invalid_data(self):
        """Setting TextField data to something to a number should raise InvalidField"""

        testfield = TextField('Title')
        testfield.set_data(6)

        try:
            testfield.validate()
            self.fail("Setting TextField data to a number should raise InvalidField")
        except InvalidField:
            pass

    def test_article_field(self):
        """Should be able to create article Field"""

        testfield = ArticleField('Title')

        article_1 = DispatchTestHelpers.create_article(self.client, headline='Test headline 1', slug='test-article-1')
        article_2 = DispatchTestHelpers.create_article(self.client, headline='Test headline 2', slug='test-article-2')

        data = [article_1.data['id'], article_2.data['id']]

        testfield.set_data(data)

        try:
            testfield.validate()
        except InvalidField:
            self.fail("Field data is valid, exception should not have been thrown")

        json = testfield.to_json()

        # Test some example entries
        self.assertEqual(json['label'], 'Title')
        self.assertEqual(json['data'][0]['id'], 1)
        self.assertEqual(json['data'][1]['id'], 2)
        self.assertEqual(json['data'][0]['headline'], u'Test headline 1')
        self.assertEqual(json['data'][1]['headline'], u'Test headline 2')

    def test_article_single_id(self):
        """Should be able to create article field with only 1 id"""

        testfield = ArticleField('Title', many=False)

        article = DispatchTestHelpers.create_article(self.client)

        data = article.data['id']

        testfield.set_data(data)

        try:
            testfield.validate()
        except InvalidField:
            self.fail("Field data is valid, exception should not have been thrown")

        json = testfield.to_json()

        # Test some example entries
        self.assertEqual(json['label'], 'Title')
        self.assertEqual(json['data']['id'], 1)
        self.assertEqual(json['data']['headline'], u'Test headline')

    def test_article_prepare_data(self):
        """Should be able to return prepared data for the template"""

        testfield = ArticleField('Title')

        article_1 = DispatchTestHelpers.create_article(self.client, headline='Test headline 1', slug='test-article-1')
        article_2 = DispatchTestHelpers.create_article(self.client, headline='Test headline 2', slug='test-article-2')

        data = [article_1.data['id'], article_2.data['id']]

        testfield.set_data(data)

        try:
            testfield.validate()
        except InvalidField:
            self.fail("Field data is valid, exception should not have been thrown")

        result = testfield.prepare_data()

        self.assertEqual(result[0].title, article_1.data['headline'])
        self.assertEqual(result[1].title, article_2.data['headline'])

    def test_article_false_many(self):
        """Test the case where many is false where you have more than 1 article"""

        testfield = ArticleField('Title', many=False)

        article_1 = DispatchTestHelpers.create_article(self.client, headline='Test headline 1', slug='test-article-1')
        article_2 = DispatchTestHelpers.create_article(self.client, headline='Test headline 2', slug='test-article-2')

        data = [article_1.data['id'], article_2.data['id']]

        testfield.set_data(data)

        try:
            testfield.validate()
            self.fail("Field data is invalid, exception should have been thrown")
        except :
            pass

    def test_image_field(self):
        """Should be able to create image field"""

        testfield = ImageField('Title')

        image_id_1 = DispatchTestHelpers.upload_image(self.client)
        image_id_2 = DispatchTestHelpers.upload_image(self.client)

        data = [image_id_1, image_id_2]

        testfield.set_data(data)

        try:
            testfield.validate()
        except InvalidField:
            self.fail("Field data is valid, exception should not have been thrown")

        json = testfield.to_json()

        image_1 = Image.objects.get(pk=image_id_1)
        image_2 = Image.objects.get(pk=image_id_2)

        self.assertEqual(json['label'], 'Title')
        self.assertEqual(json['data'][0]['id'], 1)
        self.assertEqual(json['data'][0]['filename'], image_1.filename())
        self.assertEqual(json['data'][1]['id'], 2)
        self.assertEqual(json['data'][1]['filename'], image_2.filename())


    def test_image_single_id(self):
        """Should be able to create image field with only 1 id"""

        testfield = ImageField('Title', many=False)

        image_id = DispatchTestHelpers.upload_image(self.client)

        testfield.set_data(image_id)

        try:
            testfield.validate()
        except InvalidField:
            self.fail("Field data is valid, exception should not have been thrown")

        json = testfield.to_json()

        image = Image.objects.get(pk=image_id)

        # Test some example entries
        self.assertEqual(json['label'], 'Title')
        self.assertEqual(json['data']['id'], 1)
        self.assertEqual(json['data']['filename'], image.filename())

    def test_article_prepare_data(self):
        """Should be able to return prepared data for the template"""

        testfield = ImageField('Title')

        image_id_1 = DispatchTestHelpers.upload_image(self.client)
        image_id_2 = DispatchTestHelpers.upload_image(self.client)

        data = [image_id_1, image_id_2]

        testfield.set_data(data)

        try:
            testfield.validate()
        except InvalidField:
            self.fail("Field data is valid, exception should not have been thrown")

        image_1 = Image.objects.get(pk=image_id_1)
        image_2 = Image.objects.get(pk=image_id_2)

        result = testfield.prepare_data()

        self.assertEqual(result[0].filename(), image_1.filename())
        self.assertEqual(result[1].filename(), image_2.filename())

    def test_image_false_many(self):
        """Test the case where many is false where you have more than 1 image"""

        testfield = ImageField('Title', many=False)

        image_id_1 = DispatchTestHelpers.upload_image(self.client)
        image_id_2 = DispatchTestHelpers.upload_image(self.client)

        data = [image_id_1, image_id_2]

        testfield.set_data(data)

        try:
            testfield.validate()
            self.fail("Field data is invalid, exception should have been thrown")
        except:
            pass

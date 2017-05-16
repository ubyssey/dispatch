
from dispatch.theme.fields import CharField, TextField, ArticleField, InvalidField
from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers

class WidgetFieldTest(DispatchAPITestCase):

    def test_char_field(self):
        """Should be able to initialize charfield and set data"""

        testfield = CharField('Title')
        testfield.set_data("This is a sentence")

        try:
            testfield.validate()
        except InvalidField:
            self.error("Field data is valid, exception should not have been thrown")

        self.assertEqual(testfield.to_json(), 'This is a sentence')
        self.assertEqual(testfield.prepare_data(), 'This is a sentence')

    def test_char_field_invalid_label(self):
        """Initilaizing with invalid data should raise an error"""

        try:
            testfield = CharField(6)
            self.error("Setting CharField label to a number should raise InvalidField")
        except InvalidField:
            pass

    def test_char_field_invalid_data(self):
        """Setting CharField data to something to a number should raise InvalidField"""

        testfield = CharField('Title')
        testfield.set_data(6)

        try:
            testfield.validate()
            self.error("Setting CharField data to a number should raise InvalidField")
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
            self.error("Should fail with InvalidField")
        except InvalidField:
            pass

    def test_text_field(self):
        """Should be able to initialize charfield and set data"""

        testfield = TextField('Title')
        testfield.set_data('This is a longer sentence than the one further up\nthis file')

        try:
            testfield.validate()
        except InvalidField:
            self.error("Field data is valid, exception should not have been thrown")

        self.assertEqual(testfield.to_json(), 'This is a longer sentence than the one further up\nthis file')
        self.assertEqual(testfield.prepare_data(), 'This is a longer sentence than the one further up\nthis file')

    def test_text_field_invalid_label(self):
        """Initilaizing with invalid data should raise an error"""

        try:
            testfield = TextField(6)
            self.error("Setting TextField label to a number should raise InvalidField")
        except InvalidField:
            pass

    def test_text_field_invalid_data(self):
        """Setting TextField data to something to a number should raise InvalidField"""

        testfield = TextField('Title')
        testfield.set_data(6)

        try:
            testfield.validate()
            self.error("Setting TextField data to a number should raise InvalidField")
        except InvalidField:
            pass

    def test_article_field(self):
        """Should be able to create article Field"""

        article_1 = DispatchTestHelpers.create_article(self.client)
        article_2 = DispatchTestHelpers.create_article(self.client)

        data = [article_1['id'], image_id_2['id']]

        testfield = ArticleField('Title')
        testfield.set_data(data)

        testfield.validate()

        json = testfield.to_json()

        print json

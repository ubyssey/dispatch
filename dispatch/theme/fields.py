from dispatch.apps.api.serializers import ArticleSerializer
from dispatch.apps.content.models import Article

class InvalidField(Exception):
    pass

class Field(object):
    """Base class for all widget fields"""

    def __init__(self, label, many=False):
        self.label = label

        if not isinstance(self.label, basestring):
            raise InvalidField("label must be a string")

    def validate(self):
        """Validates the field data"""
        raise NotImplementedError

    def set_data(self, data):
        """Assigns data to this instance of the field"""
        self.data = data

    def to_json(self):
        """Returns JSON representation of field data"""
        return self.data

    def prepare_data(self):
        """Prepares field data for use in a template"""
        return self.data

class CharField(Field):

    type = 'char'

    def validate(self):

        if not isinstance(self.data, basestring):
            raise InvalidField('%s data must be a string' % self.label)

        elif len(self.data) > 255:
            raise InvalidField('Max length for charfield data is 255')

class TextField(Field):

    type = 'string'

    def validate(self):
        if not isinstance(self.data, basestring):
            raise InvalidField('%s data must be a string' % self.label)

class ArticleField(Field):

    type = 'list'

    @classmethod
    def get_article(self, id):
        try:
            return Article.objects.get(pk=id)
        except:
            raise InvalidField('Oh good lord help us all')


    def validate(self):
        if not isinstance(self.data, list):
            raise InvalidField('%s data must be a list' % self.label)

    def to_json(self):

        json_data = {}

        for id in self.data:

            article = self.get_article(id)

            serializer = ArticleSerializer(article)
            article_data = serializer.data

            json_data[id] = article_data

        return json_data

class ImageField(Field):
    # TODO
    pass

from dispatch.apps.api.serializers import ArticleSerializer, ImageSerializer
from dispatch.apps.content.models import Article, Image

class InvalidField(Exception):
    pass

class Field(object):
    """Base class for all widget fields"""

    def __init__(self, label, many=True):
        self.label = label
        self.many = many

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

    type = 'text'

    def validate(self):
        if not isinstance(self.data, basestring):
            raise InvalidField('%s data must be a string' % self.label)

class ArticleField(Field):

    type = 'article'

    def validate(self):
        if self.many:
            if not all( [isinstance(id, int) for id in self.data] ):
                raise InvalidField('Data must be list of integers')
        else:
            if not isinstance(self.data, int):
                raise InvalidField('Data must be an integer')

    def get_article(self, id):
        try:
            return Article.objects.get(pk=id)
        except Article.DoesNotExist:
            raise Article.DoesNotExist('Article does not exist')

    def get_article_json(self, id):
        article = self.get_article(id)
        serializer = ArticleSerializer(article)
        return serializer.data

    def to_json(self):
        if self.many:
            return {
                'label' : self.label,
                'data' : map(self.get_article_json, self.data)
            }
        else:
            return {
                'label' : self.label,
                'data' : self.get_article_json(self.data)
            }

    def prepare_data(self):
        if self.many:
            return map(self.get_article, self.data)
        else:
            return self.get_article(self.data)

class ImageField(Field):

    type = 'image'

    def validate(self):
        if self.many:
            return {
                'label' : self.label,
                'data' : map(self.get_image_json, self.data)
            }
        else:
            return {
                'label' : self.label,
                'data' : self.get_image_json(self.data)
            }

    def get_image(self, id):
        try:
            return Image.objects.get(pk=id)
        except Image.DoesNotExist:
            raise Image.DoesNotExist('Image does not exist')

    def get_image_json(self, id):
        image = self.get_image(id)
        serializer = ImageSerializer(image)
        return serializer.data

    def to_json(self):
        if self.many:
            return {
                'label' : self.label,
                'data' : map(self.get_image_json, self.data)
            }
        else:
            return {
                'label' : self.label,
                'data' : self.get_image_json(self.data)
            }

    def prepare_data(self):
        if self.many:
            return map(self.get_image, self.data)
        else:
            return self.get_image(self.data)

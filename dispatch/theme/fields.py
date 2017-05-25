from dispatch.apps.api.serializers import ArticleSerializer, ImageSerializer, WidgetSerializer, EventSerializer
from dispatch.apps.content.models import Article, Image, Event

from dispatch.theme import ThemeManager
from dispatch.theme.exceptions import InvalidField, WidgetNotFound

class Field(object):
    """Base class for all widget fields"""

    _creation_counter = 0

    def __init__(self, label, many=False):
        self.label = label
        self.many = many

        if self.many:
            self.default = []
        else:
            self.default = None

        self._creation_counter = Field._creation_counter
        Field._creation_counter += 1

        if not isinstance(self.label, basestring):
            raise InvalidField('Label must be a string')

    def validate(self, data):
        """Validates the field data"""
        raise NotImplementedError

    def to_json(self, data):
        """Returns JSON representation of field data"""
        return data

    def prepare_data(self, data):
        """Prepares field data for use in a template"""
        return data

class ModelField(Field):
    """Base class for model widget fields"""

    def validate(self, data):
        if self.many:
            if not isinstance(data, list) or not all([isinstance(id, int) for id in data]):
                raise InvalidField('Data must be list of integers')
        else:
            if not isinstance(data, int):
                raise InvalidField('Data must be an integer')

    def get_model(self, id):
        try:
            return self.model.objects.get(pk=id)
        except self.model.DoesNotExist:
            raise self.model.DoesNotExist('%s with id %s does not exist' % (self.model, id))

    def get_model_json(self, id):
        model = self.get_model(id)
        serializer = self.serializer(model)
        return serializer.data

    def to_json(self, data):
        if not data:
            return self.default

        try:
            if self.many:
                return map(self.get_model_json, data)
            else:
                return self.get_model_json(data)
        except:
            return self.default

    def prepare_data(self, data):
        if not data:
            return self.default

        if self.many:
            return map(self.get_model, data)
        else:
            return self.get_model(data)


class CharField(Field):

    type = 'char'

    def validate(self, data):

        if not isinstance(data, basestring):
            raise InvalidField('%s data must be a string' % self.label)

        if len(data) > 255:
            raise InvalidField('Max length for charfield data is 255')

class TextField(Field):

    type = 'text'

    def validate(self, data):
        if not isinstance(data, basestring):
            raise InvalidField('%s data must be a string' % self.label)

class ArticleField(ModelField):

    type = 'article'

    model = Article
    serializer = ArticleSerializer

class ImageField(ModelField):

    type = 'image'

    model = Image
    serializer = ImageSerializer

class WidgetField(Field):

    type = 'widget'

    def validate(self, data):
        if not isinstance(data, basestring):
            raise InvalidField('Data must be a string')

    def get_widget(self, id):
        try:
            return ThemeManager.Widgets.get(id)
        except WidgetNotFound:
            raise WidgetNotFound('Widget with id %s does not exist' % id)

    def get_widget_json(self, data):
        widget = self.get_widget(data['id'])
        widget.set_data(data['data'])

        return {
            'id': data['id'],
            'data': widget.to_json()
        }

    def to_json(self, data):
        if not data:
            return self.default

        return self.get_widget_json(data)

    def prepare_data(self, data):
        widget = self.get_widget(data['id'])
        widget.set_data(data['data'])
        return widget

class EventField(ModelField):

    type = 'event'

    model = Event
    serializer = EventSerializer

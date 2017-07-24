from django.utils.dateparse import parse_datetime

from dispatch.apps.api.serializers import ArticleSerializer, ImageSerializer, WidgetSerializer, EventSerializer
from dispatch.apps.content.models import Article, Image
from dispatch.apps.events.models import Event

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
                raise InvalidField('Data must be list of integer IDs')
        else:
            if not isinstance(data, int):
                raise InvalidField('Data must be an integer ID')

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

class DateTimeField(Field):

    type = 'datetime'

    def validate(self, data):
        if not parse_datetime(data):
            raise InvalidField('%s must be valid format' % self.label)

    def prepare_data(self, data):
        return parse_datetime(data)

class IntegerField(Field):

    type = 'integer'
    def __init__(self, label, many=False, min_value=None, max_value=None):
        self.min_value = min_value
        self.max_value = max_value

        if min_value is not None and max_value is not None:
            if min_value > max_value:
                raise InvalidField('IntegerField: min_value must be less than max_value')

        super(IntegerField, self).__init__(label=label, many=many)

    def validate(self, data):
        try:
            if isinstance(data, int):
                value = data
            else:
                value =  int(data, base=10)
        except ValueError:
            raise InvalidField('%s must be integer' % self.label)

        if self.min_value is not None and value < self.min_value:
            raise InvalidField('%s must be greater than %d' % (self.label, self.min_value))

        if self.max_value is not None and value > self.max_value:
            raise InvalidField('%s must be less than than %d' % (self.label, self.max_value))

    def prepare_data(self, data):
        if isinstance(data, int):
            return data
        return int(data, base=10)

class ArticleField(ModelField):

    type = 'article'

    model = Article
    serializer = ArticleSerializer

class ImageField(ModelField):

    type = 'image'

    model = Image
    serializer = ImageSerializer

class EventField(ModelField):

    type = 'event'

    model = Event
    serializer = EventSerializer


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

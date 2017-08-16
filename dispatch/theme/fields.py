import json

from django.utils.dateparse import parse_datetime

from dispatch.apps.api.serializers import ArticleSerializer, ImageSerializer, WidgetSerializer, EventSerializer
from dispatch.apps.content.models import Article, Image
from dispatch.apps.events.models import Event

from dispatch.theme import ThemeManager
from dispatch.theme.exceptions import InvalidField, WidgetNotFound

class Field(object):
    """Base class for all widget fields"""

    _creation_counter = 0

    def __init__(self, label, many=False, required=False):
        self.label = label
        self.many = many
        self.required = required

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

        if not len(data) and self.required:
            raise InvalidField('%s is required' % self.label)

class TextField(Field):

    type = 'text'

    def validate(self, data):
        if not isinstance(data, basestring):
            raise InvalidField('%s data must be a string' % self.label)

        if not len(data) and self.required:
            raise InvalidField('%s is required' % self.label)

class DateTimeField(Field):

    type = 'datetime'

    def validate(self, data):
        if not data or (isinstance(data, basestring) and not len(data)):
            if self.required:
                raise InvalidField('%s is required')
            else:
                return

        if not parse_datetime(data):
            raise InvalidField('%s must be valid format' % self.label)

    def prepare_data(self, data):
        return parse_datetime(data) if data and isinstance(data, basestring) else None

class IntegerField(Field):

    type = 'integer'
    def __init__(self, label, many=False, min_value=None, max_value=None, required=False):
        self.min_value = min_value
        self.max_value = max_value

        if min_value is not None and max_value is not None:
            if min_value > max_value:
                raise InvalidField('IntegerField: min_value must be less than max_value')

        super(IntegerField, self).__init__(label=label, many=many, required=required)

    def validate(self, data):
        if not data or (isinstance(data, basestring) and not len(data)):
            if self.required:
                raise InvalidField('%s is required')
            else:
                return

        try:
            if isinstance(data, int):
                value = data
            else:
                value = int(data, base=10)
        except ValueError:
            raise InvalidField('%s must be integer' % self.label)

        if self.min_value is not None and value < self.min_value:
            raise InvalidField('%s must be greater than %d' % (self.label, self.min_value))

        if self.max_value is not None and value > self.max_value:
            raise InvalidField('%s must be less than than %d' % (self.label, self.max_value))

    def prepare_data(self, data):
        if isinstance(data, int):
            return data
        try:
            return int(data, base=10)
        except ValueError, TypeError:
            return None

class BoolField(Field):

    type = 'bool'

    def validate(self, data):
        if type(data) is not bool:
            raise InvalidField('%s must be boolean' % self.label)

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

    def __init__(self, label, widgets, required=False):
        super(WidgetField, self).__init__(label, required=required)
        self.widgets = {}

        for widget in widgets:
            self.widgets[widget.id] = WidgetSerializer(widget).data


    def validate(self, data):
        if not data or not data['id']:
            if self.required:
                raise InvalidField('Widget must be selected')
            return

        try:
            if data['id'] and data['data'] is not None:
                errors = {}
                widget = None

                try:
                    widget = self.get_widget(data['id'])
                except WidgetNotFound:
                    errors['self'] = 'Invalid Widget'

                if widget:
                    for field in widget.fields:
                        if field.name in data['data'] and data['data'][field.name]:
                            try:
                                field.validate(data['data'][field.name])
                            except InvalidField as e:
                                errors[field.name] = str(e)
                        else:
                            if field.required:
                                errors[field.name] = 'This field is required'

                if len(errors):
                    raise InvalidField(json.dumps(errors))
            else:
                raise InvalidField('Invalid Widget Data')
        except InvalidField as e:
            raise e
        except Exception as e:
            raise InvalidField('Problem with widget data %s' % str(e))


    def get_widget(self, id):
        if id is None:
            return None

        try:
            return ThemeManager.Widgets.get(id)
        except WidgetNotFound:
            raise WidgetNotFound('Widget with id %s does not exist' % id)

    def get_widget_json(self, data):
        widget = self.get_widget(data['id'])
        widget.set_data(data['data'])

        return {
            'id': data['id'],
            'data': widget.to_json(),
            'widget': WidgetSerializer(widget).data
        }

    def to_json(self, data):
        if not data:
            return self.default

        return self.get_widget_json(data)

    def prepare_data(self, data):
        widget = self.get_widget(data['id'])
        widget.set_data(data['data'])
        return widget

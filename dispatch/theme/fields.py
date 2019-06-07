import json

from django.db.models import Case, When
from django.utils.dateparse import parse_datetime
from django.core.exceptions import ObjectDoesNotExist
from django.db import NotSupportedError

from dispatch.models import Article, Image, Poll, PodcastEpisode
from dispatch.api.serializers import (
    ArticleSerializer, ImageSerializer, TopicSerializer,
     WidgetSerializer, PollSerializer, PodcastEpisodeSerializer)

from dispatch.theme.exceptions import InvalidField, WidgetNotFound
from dispatch.theme.validators import is_valid_id

class MetaFields(type):
    """Metaclass that adds field support to an object"""

    def __new__(cls, name, bases, classdict):
        def prepare_fields():

            def get_field(name, field):
                field.name = name
                return field

            fields = [f for f in list(classdict.items()) if f[0] != 'fields' and isinstance(f[1], Field)]
            fields.sort(key=lambda f: f[1]._creation_counter)

            return [get_field(name, field) for name, field in fields]

        classdict['fields'] = prepare_fields()

        return type.__new__(cls, name, bases, classdict)

class Field(object):
    """Base class for all fields"""

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

        if not isinstance(self.label, str):
            raise InvalidField('Label must be a string')

    def validate(self, data):
        """Validates the field data"""
        raise NotSupportedError

    def to_json(self, data):
        """Returns JSON representation of field data"""
        return data

    def prepare_data(self, data):
        """Prepares field data for use in a template"""
        return data

class ModelField(Field):
    """Base class for model fields"""

    def validate(self, data):
        if self.many:
            if not isinstance(data, list) or not all([is_valid_id(id) for id in data]):
                raise InvalidField('Data must be list of integers or UUIDs')
        else:
            if not is_valid_id(data):
                raise InvalidField('Data must be an integer or UUID')

    def get_many(self, ids):
        id_order = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(ids)])
        return self.model.objects \
            .filter(pk__in=ids) \
            .order_by(id_order)

    def get_single(self, id):
        try:
            return self.model.objects.get(pk=id)
        except self.model.DoesNotExist:
            raise self.model.DoesNotExist('%s with id %s does not exist' % (self.model, id))

    def get_model_json(self, id):
        model = self.get_single(id)
        serializer = self.serializer(model)
        return serializer.data

    def to_json(self, data):
        if not data:
            return self.default

        try:
            if self.many:
                return list(map(self.get_model_json, data))
            else:
                return self.get_model_json(data)
        except:
            return self.default

    def prepare_data(self, data):
        if not data:
            return self.default

        try:
            if self.many:
                return self.get_many(data)
            else:
                return self.get_single(data)
        except ObjectDoesNotExist:
            return self.default


class CharField(Field):
    type = 'char'

    def validate(self, data):
        if not isinstance(data, str):
            raise InvalidField('%s data must be a string' % self.label)

        if len(data) > 255:
            raise InvalidField('Max length for charfield data is 255')

        if not len(data) and self.required:
            raise InvalidField('%s is required' % self.label)

class TextField(Field):
    type = 'text'

    def validate(self, data):
        if not isinstance(data, str):
            raise InvalidField('%s data must be a string' % self.label)

        if not len(data) and self.required:
            raise InvalidField('%s is required' % self.label)

class DateTimeField(Field):
    type = 'datetime'

    def validate(self, data):
        if not data or (isinstance(data, str) and not len(data)):
            if self.required:
                raise InvalidField('%s is required' % self.label)
            else:
                return

        if not parse_datetime(data):
            raise InvalidField('%s must be valid format' % self.label)

    def prepare_data(self, data):
        return parse_datetime(data) if data and isinstance(data, str) else None

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
        if not data or (isinstance(data, str) and not len(data)):
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
        except (ValueError, TypeError):
            return None

class BoolField(Field):
    type = 'bool'

    def validate(self, data):
        if type(data) is not bool:
            raise InvalidField('%s must be boolean' % self.label)

class SelectField(Field):
    type = 'select'

    def __init__(self, label, options=[], required=False):
        self.options = options
        self.valid_options = set(option[0] for option in self.options)

        if required and not self.options:
            raise InvalidField('Empty select fields cannot be required fields')

        super(SelectField, self).__init__(label=label, many=False, required=required)

    def validate(self, data):
        if data == '' or data is None:
            if self.required:
                raise InvalidField('%s is required' % self.label)
            return

        if data not in self.valid_options:
            raise InvalidField('%s is not a valid option' % data)

class ArticleField(ModelField):
    type = 'article'

    from dispatch.models import Article

    model = Article
    serializer = ArticleSerializer

class TopicField(ModelField):
    type = 'topic'

    from dispatch.models import Topic

    model = Topic
    serializer = TopicSerializer

class ImageField(ModelField):
    type = 'image'

    from dispatch.models import Image

    model = Image
    serializer = ImageSerializer

class PollField(ModelField):
    type = 'poll'

    model = Poll
    serializer = PollSerializer

class PodcastField(ModelField):
    type = 'podcast'

    model = PodcastEpisode
    serializer = PodcastEpisodeSerializer

class WidgetField(Field):
    type = 'widget'

    def __init__(self, label, widgets, required=False):
        super(WidgetField, self).__init__(label, required=required)
        self.widgets = {}

        for widget in widgets:
            self.widgets[widget.id] = WidgetSerializer(widget).data

    def validate(self, data):
        if not data and self.required:
            raise InvalidField('Widget must be selected')

        if not data['id']:
            raise InvalidField("Must specify a widget id")

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
        from dispatch.theme import ThemeManager

        if id is None:
            return None

        try:
            return ThemeManager.Widgets.get(id)
        except WidgetNotFound:
            raise WidgetNotFound('Widget with id %s does not exist' % id)

    def get_widget_json(self, data):
        widget = self.get_widget(data['id'])

        if widget is None:
            return None

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
        if data is None:
            return None

        widget = self.get_widget(data['id'])
        widget.set_data(data['data'])
        return widget

class InstructionField(Field):
    type = 'instruction'

    def __init__(self, label, options=[], required=False):
        self.options = options
        self.valid_options = set(option[0] for option in self.options)

        super(InstructionField, self).__init__(label=label, many=False, required=required)

    def validate(self, data):
        pass
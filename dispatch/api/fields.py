import json

from rest_framework.fields import Field, empty
from rest_framework.exceptions import ValidationError

class JSONField(Field):

    def to_internal_value(self, data):
        return data

    def to_representation(self, value):
        return value

class PrimaryKeyField(Field):

    def __init__(self, serializer, *args, **kwargs):
        super(PrimaryKeyField, self).__init__(*args, **kwargs)

        self.serializer = serializer

    def to_internal_value(self, data):
        return data

    def to_representation(self, value):
        return self.serializer.to_representation(value)

class ForeignKeyField(Field):
    """Special field to handle reading/writing foreign key relationships.
    When reading, the field will return a serialized representation of the related object.
    When performing a write, the field expects an integer representing the ID of the
    related object."""

    def __init__(self, model, serializer, *args, **kwargs):
        super(ForeignKeyField, self).__init__(*args, **kwargs)

        self.model = model
        self.serializer = serializer

    def to_internal_value(self, data):
        try:
            return self.model.objects.get(pk=data)
        except self.model.DoesNotExist:
            # Raise validation error if referenced object does not exist
            raise ValidationError(
                'The %s with primary key %d does not exist' % (self.model.__name__, data)
            )

    def to_representation(self, value):
        return self.serializer.to_representation(value)

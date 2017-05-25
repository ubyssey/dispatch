import json

from rest_framework import serializers

class JSONField(serializers.Field):

    def to_internal_value(self, value):
        return value

    def to_representation(self, value):
        return value

class PrimaryKeyField(serializers.Field):
    """Special field to handle reading/writing foreign key relationships.

    When reading, the field will return a serialized representation of the related object.
    When performing a write, the field expects an integer representing the ID of the 
    related object."""

    def __init__(self, serializer, *args, **kwargs):
        super(PrimaryKeyField, self).__init__(*args, **kwargs)

        self.serializer = serializer

    def to_internal_value(self, value):
        return value

    def to_representation(self, value):
        return self.serializer.to_representation(value)

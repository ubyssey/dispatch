import json

from rest_framework import serializers

class JSONField(serializers.Field):

    def to_internal_value(self, value):
        return value

    def to_representation(self, value):
        return value

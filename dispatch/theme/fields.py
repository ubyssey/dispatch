class InvalidField(Exception):
    pass

class Field(object):
    """Base class for all widget fields"""

    def __init__(self, label):
        self.label = label

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

    def validate(self):
        if not isinstance(self.data, basestring):
            raise InvalidField('%s data must be a string' % self.label)

class TextField(Field):
    # TODO
    pass

class ArticleField(Field):
    # TODO
    pass

class ImageField(Field):
    # TODO
    pass

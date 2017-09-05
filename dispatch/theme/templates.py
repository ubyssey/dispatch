from dispatch.theme.fields import MetaFields

class Template:

    __metaclass__ = MetaFields

    def __init__(self):
        self.data = {}

    def set_data(self, data):
        """Sets data for each field"""
        self.data = data

    def to_json(self):
        """Return JSON representation for this template"""
        result = {}

        for field in self.fields:
            result[field.name] = field.to_json(self.data.get(field.name))

        return result

    def prepare_data(self):
        """Prepare data for Django template"""
        result = {}

        for field in self.fields:
            result[field.name] = field.prepare_data(self.data.get(field.name))

        return result

class Default(Template):
    id = 'default'
    name = 'Default'

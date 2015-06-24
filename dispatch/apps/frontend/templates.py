from dispatch.apps.frontend.helpers import templates

class BaseTemplate:

    def __init__(self, data=None):
        if data is not None:
            self.data = {}
            for name, label, field_class in self.fields:
                self.data[name] = data.get('fields['+name+']', None)

    def to_json(self):
        return {
            'name': self.NAME,
            'slug': self.SLUG,
            'fields': self.fields_as_json() if hasattr(self, 'fields') else []
        }

    def field_data_as_json(self):
        output = {}
        for name, label, field_obj in self.fields:
            if name in self.saved_fields:
                field_obj.set_value(self.saved_fields[name].value)
                output[name] = field_obj.data_as_json()
        return output

    def fields_as_json(self):
        data = []
        for field, label, field_class in self.fields:
            field_json = field_class.as_json()
            field_json['name'] = field
            field_json['label'] = label
            data.append(field_json)
        return data

class Default(BaseTemplate):

    NAME = 'Default'
    SLUG = 'default'

templates.register(Default)
class Template:

    fields = ()

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'fields': self.fields_to_json() if hasattr(self, 'fields') else []
        }

    def fields_to_json(self):
        return [dict(field_class.as_json(),
                     name=field, label=label)
                for field, label, field_class in self.fields]

class Default(Template):
    id = 'default'
    name = 'Default'

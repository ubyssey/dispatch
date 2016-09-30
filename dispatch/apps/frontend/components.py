from dispatch.apps.frontend.models import Component, ComponentField
from django.template import loader, Context

class BaseComponent:

    def __init__(self, data=None, **kwargs):
        self.rendered = False

        if 'instance' in kwargs:
            self.instance = kwargs['instance']
        else:
            self.instance = None

        if 'spot' in kwargs:
            self.spot = kwargs['spot']

        if data is not None:
            self.data = {}
            for name, label, field_class in self.fields:
                self.data[name] = data.get('fields['+name+']', None)

    def fetch_data(self):
        self.context = {}
        self.saved_fields = {}
        for field in self.instance.fields.all():
            self.saved_fields[field.name] = field
        for name, label, field_obj in self.fields:
            if name in self.saved_fields:
                saved_field = self.saved_fields[name]
                field_obj.set_value(saved_field.value)
                self.context[name] = field_obj.context()

    def __str__(self):
        # Attempt to render cached version
        if not self.rendered:
            self.fetch_data()
            template = loader.get_template("components/"+self.SLUG+".html")
            c = Context(self.context)
            self.rendered = template.render(c).encode('utf-8')

        return self.rendered

    def field_data_as_json(self):
        self.fetch_data()
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

    def save(self):
        if self.instance is None:
            self.instance = Component(slug=self.SLUG, spot=self.spot)
            self.instance.save()

        for field, label, field_class in self.fields:
            if field in self.data and self.data[field] is not None:
                try:
                    field_instance = self.instance.fields.get(name=field)
                    if not self.data[field]:
                        self.instance.fields.remove(field_instance)
                    else:
                        field_instance.value = self.data[field]
                        field_instance.save()
                except ComponentField.DoesNotExist:
                    if self.data[field]:
                        field_instance = ComponentField(name=field, value=self.data[field])
                        field_instance.save()
                        self.instance.fields.add(field_instance)

        for f in self.instance.fields.all():
            print f.name

        self.instance.save()

        return self.instance

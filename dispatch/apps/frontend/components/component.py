from dispatch.apps.frontend.models import Component, ComponentField
from django.template import loader, Context

class BaseComponent:

    def __init__(self, data=None, **kwargs):

        if 'instance' in kwargs:
            self.instance = kwargs['instance']
        else:
            self.instance = None

        if 'spot' in kwargs:
            self.spot = kwargs['spot']

        if data is not None:
            self.data = {}
            for name, label, field_class in self.fields:
                self.data[name] = data.get('fields['+name+']')
        elif self.instance is not None:
            self.context = {}
            saved_fields = {}
            for field in self.instance.fields.all():
                saved_fields[field.name] = field
            for name, label, field_obj in self.fields:
                saved_field = saved_fields[name]
                field_obj.set_value(saved_field.value)
                self.context[name] = field_obj.context()


    def __str__(self):
        template = loader.get_template("components/"+self.SLUG+".html")
        c = Context(self.context)
        return template.render(c).encode('utf-8')

    def __iter__(self):
        if self.instance is not None:
            return self.rendered.__iter__()

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
            if field in self.data:
                field_instance = ComponentField(name=field, value=self.data[field])
                field_instance.save()
                self.instance.fields.add(field_instance)

        self.instance.save()

        return self.instance



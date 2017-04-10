from django.db.models import Model, IntegerField, CharField, TextField, ManyToManyField, SlugField

class ComponentSet(Model):
    slug = SlugField()
    components = ManyToManyField('Component')

class Component(Model):
    slug = CharField(max_length=50)
    spot = CharField(max_length=50)
    fields = ManyToManyField('ComponentField')

class ComponentField(Model):
    name = CharField(max_length=50)
    value = TextField()

class TemplateVariable(Model):
    article_id = IntegerField()
    template_slug = CharField(max_length=255)
    variable = CharField(max_length=50)
    value = TextField()

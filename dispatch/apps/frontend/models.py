from django.db.models import Model, IntegerField, CharField, TextField, FileField, ManyToManyField, SlugField

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

class FileResource(Model):
    name = CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name or self.filename

class Snippet(FileResource):
    source = FileField(upload_to='snippets')

class Script(FileResource):
    source = FileField(upload_to='scripts')

class Stylesheet(FileResource):
    source = FileField(upload_to='stylesheets')


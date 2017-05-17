from jsonfield import JSONField

from django.db.models import Model, IntegerField, CharField, TextField, SlugField

class TemplateVariable(Model):
    article_id = IntegerField()
    template_slug = CharField(max_length=255)
    variable = CharField(max_length=50)
    value = TextField()

class Zone(Model):
    zone_id = SlugField(primary_key=True)
    widget_id = SlugField(null=True)
    data = JSONField(null=True)

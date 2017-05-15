from django.db.models import Model, IntegerField, CharField, TextField

class TemplateVariable(Model):
    article_id = IntegerField()
    template_slug = CharField(max_length=255)
    variable = CharField(max_length=50)
    value = TextField()

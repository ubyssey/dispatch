from dispatch.apps.content.models import Article
from django.template import loader, Context

class BaseField(object):

    def set_value(self, value):
        self.value = value

class TextField(BaseField):

    @staticmethod
    def as_json():
        return {
            'type': 'text',
        }

    def context(self):
        return self.value

class ModelField(BaseField):

    def __init__(self, model, many=False):
        self.model = model
        self.many = many

    def as_json(self):
        return {
            'type': 'model',
            'model': self.model,
            'key': 'parent',
            'display': 'long_headline',
            'many': self.many,
        }

    def context(self):
        ids = [int(id) for id in self.value.split(',')]
        article = Article.objects.filter(parent__in=ids,head=True)
        try:
            return article
        except:
            return None
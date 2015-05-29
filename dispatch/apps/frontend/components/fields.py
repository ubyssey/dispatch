from dispatch.apps.content.models import Article
from django.template import loader, Context

class BaseField(object):

    def set_value(self, value):
        self.value = value

class TextField(BaseField):

    def as_json(self):
        return {
            'type': 'text',
        }

    def data_as_json(self):
        return self.value

    def context(self):
        return self.value

class ModelField(BaseField):

    KEY = 'parent'
    DISPLAY = 'long_headline'

    def __init__(self, model, many=False):
        self.model = model
        self.many = many

    def as_json(self):
        return {
            'type': 'model',
            'model': self.model,
            'key': self.KEY,
            'display': self.DISPLAY,
            'many': self.many,
        }

    def data_as_json(self):
        ids = [int(id) for id in self.value.split(',')]
        articles = Article.objects.filter(parent__in=ids,head=True)
        return [
            {'id': getattr(a, self.KEY).id, 'display': getattr(a, self.DISPLAY)}
            for a in articles
        ]

    def context(self):
        ids = [int(id) for id in self.value.split(',')]
        articles = Article.objects.filter(parent__in=ids,head=True)
        try:
            return articles
        except:
            return None
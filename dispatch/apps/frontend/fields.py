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

class SelectField(BaseField):

    def __init__(self, options=()):
        self.options = options

    def as_json(self):
        return {
            'type': 'select',
            'options': self.options,
        }

class ModelField(BaseField):

    KEY = 'parent'
    DISPLAY = 'headline'

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
        articles = self.context()
        return [
            {'id': getattr(a, self.KEY).id, self.DISPLAY: getattr(a, self.DISPLAY)}
            for a in articles or []
        ]

    def context(self):
        ids = map(int, self.value.split(','))
        articles = list(Article.objects.filter(parent__in=ids, head=True).select_related())
        articles.sort(key=lambda article: ids.index(article.parent.id))
        return articles or None

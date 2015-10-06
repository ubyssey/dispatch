from dispatch.apps.frontend.helpers import templates
from dispatch.apps.frontend.models import TemplateVariable

class TemplateManager:

    @staticmethod
    def save_fields(article_id, template_slug, fields):
        entries = [TemplateVariable(article_id=article_id, template_slug=template_slug, variable=field, value=value) for field, value in fields.iteritems()]
        TemplateVariable.objects.bulk_create(entries)


class BaseTemplate:

    def __init__(self, article_id=None):
        self.article_id = article_id

    def to_json(self):
        return {
            'name': self.NAME,
            'slug': self.SLUG,
            'fields': self.fields_as_json() if hasattr(self, 'fields') else []
        }

    def field_data_as_json(self):
        output = {}
        for field, label, field_class in self.fields:
            try:
                field_data= TemplateVariable.objects.get(article_id=self.article_id, variable=field, template_slug=self.SLUG)
                output[field] = field_data.value
            except:
                pass
        return output

    def fields_as_json(self):
        return [dict(field_class.as_json(),
                     name=field, label=label)
                for field, label, field_class in self.fields]


class Default(BaseTemplate):

    NAME = 'Default'
    SLUG = 'default'

templates.register(Default)

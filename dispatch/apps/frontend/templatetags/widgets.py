from django.core.urlresolvers import reverse
from django.template.Library import simple_tag

@register.simple_tag
def zones(zone):
    widgets = zone.widgets()
    return {'widgets' : widgets}

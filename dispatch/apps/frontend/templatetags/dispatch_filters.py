from django import template
import re
from dispatch.apps.frontend.shortcodes import sclib

register = template.Library()

def process_shortcode(code):
    f = re.compile('\[[a-z]+')
    func = f.search(code.group(0))
    print func
    args = re.findall(r'(\".+\"|[0-9]+)+', code.group(0))
    if func:
        func_name = func.group(0)[1:]
        return sclib.call(func_name, args)

@register.filter(name='shortcodes')
def shortcodes(value):
    return re.sub(r'\[[^\[\]]*\]', process_shortcode, value)
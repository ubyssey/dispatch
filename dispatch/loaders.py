from django.template import TemplateDoesNotExist
from helpers import ThemeHelper

# TODO: Make this code more intuitive (use a loop)
def load_template_source(template_name, template_dirs=None):
    try:
        return open(ThemeHelper.get_template_dir() + template_name).read(), template_name
    except IOError:
        try:
            return open('resources/snippets/' + template_name).read(), template_name
        except IOError:
            raise TemplateDoesNotExist, template_name
load_template_source.is_usable = True
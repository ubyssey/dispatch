from django.template import TemplateDoesNotExist
from helpers import ThemeHelper

def load_template_source(template_name, template_dirs=None):
    try:
        return open(ThemeHelper.get_template_dir() + template_name).read(), template_name
    except IOError:
        try:
            return open(ThemeHelper.get_template_dir("default") + template_name).read(), template_name
        except IOError:
            raise TemplateDoesNotExist, template_name
load_template_source.is_usable = True
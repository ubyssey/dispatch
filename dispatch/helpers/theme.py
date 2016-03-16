import importlib
from django.conf import settings

class ThemeHelper():

    @staticmethod
    def get_current_theme():
        return settings.DISPATCH_PROJECT_MODULE

    @staticmethod
    def get_theme_templates(theme_name=False):
        if not theme_name:
            theme_name = ThemeHelper.get_current_theme()
        try:
            templates = importlib.import_module(theme_name + ".templates")
            templates = templates.templates.all()
        except:
            templates = []
        return templates

    @staticmethod
    def get_theme_template(theme_name=False, template_slug=None):
        if not theme_name:
            theme_name = ThemeHelper.get_current_theme()
        try:
            templates = importlib.import_module(theme_name + ".templates")
            template = templates.templates.get(template_slug)
        except:
            template = None
        return template

    @staticmethod
    def get_theme_urls(theme_name=False):
        if not theme_name:
            theme_name = ThemeHelper.get_current_theme()
        try:
            return ThemeHelper.fetch_theme_urls(theme_name)
        except ImportError:
            return ThemeHelper.fetch_theme_urls("default")

    @staticmethod
    def fetch_theme_urls(theme_name):
        urls = importlib.import_module(theme_name + ".urls")
        return urls.theme_urls

    @staticmethod
    def get_static_dir(theme_name=False):
        if not theme_name:
            theme_name = ThemeHelper.get_current_theme()
        return 'dispatch/themes/' + theme_name + '/static/'

    @staticmethod
    def get_template_dir(theme_name=False):
        if not theme_name:
            theme_name = ThemeHelper.get_current_theme()
        return 'dispatch/themes/' + theme_name + '/templates/'

    @staticmethod
    def get_theme_pages():
        theme_name = ThemeHelper.get_current_theme()
        pages = importlib.import_module(theme_name + ".pages")
        return pages.theme_pages

    @staticmethod
    def get_theme_components():
        theme_name = ThemeHelper.get_current_theme()
        components = importlib.import_module(theme_name + ".components")
        return components.theme_components

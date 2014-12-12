import importlib
from apps.core.models import Setting

class ThemeHelper():

    @staticmethod
    def get_theme_urls(theme_name=False):
        if not theme_name:
            try:
                theme_setting = Setting.objects.get(name="current_theme")
                theme_name = theme_setting.value
            except Setting.DoesNotExist:
                theme_name = "default"
        try:
            return ThemeHelper.fetch_theme_urls(theme_name)
        except ImportError:
            return ThemeHelper.fetch_theme_urls("default")

    @staticmethod
    def fetch_theme_urls(theme_name):
        urls = importlib.import_module("themes."+theme_name+".urls")
        return urls.theme_urls
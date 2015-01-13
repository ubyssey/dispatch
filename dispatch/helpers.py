import importlib
from apps.core.models import Setting
from django.conf import settings
import os

class ThemeHelper():

    @staticmethod
    def get_current_theme():
        try:
            theme_setting = Setting.objects.get(name="current_theme")
            theme_name = theme_setting.value
        except Setting.DoesNotExist:
            theme_name = "default"
        return theme_name

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
        try:
            urls = importlib.import_module("themes." + theme_name + ".urls")
        except ImportError:
            urls = importlib.import_module("dispatch.apps.frontend.themes.default.urls")
        return urls.theme_urls

    @staticmethod
    def get_static_dir(theme_name=False):
        if not theme_name:
            theme_name = ThemeHelper.get_current_theme()
        return '/themes/' + theme_name + '/static/'

    @staticmethod
    def get_template_dir(theme_name=False):
        if not theme_name:
            theme_name = ThemeHelper.get_current_theme()
        return 'themes/' + theme_name + '/templates/'

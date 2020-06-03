import environ
from django.apps import AppConfig


class DispatchConfig(AppConfig):
    name = 'dispatch'
    path = environ.Path(__file__) - 1
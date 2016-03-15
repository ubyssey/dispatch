from django.core.management import execute_from_command_line as dj_execute_from_command_line
from django.conf import settings

from dispatch.conf import default_settings

def configure_settings():

    if settings.configured:
        # Abort if settings are already configured
        return

    PROJECT_SETTINGS_MODULE = '%s.settings' % default_settings.DISPATCH_PROJECT_MODULE
    project_settings_module = __import__(PROJECT_SETTINGS_MODULE).settings

    project_settings = {}

    # Add project settings
    for key in project_settings_module.__dict__:
        if not key.startswith('__'):
            project_settings[key] = getattr(project_settings_module, key)

    settings.configure(default_settings, **project_settings)

def execute_from_command_line(argv=None):

    configure_settings()

    return dj_execute_from_command_line(argv)

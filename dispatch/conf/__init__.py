from django.conf import settings as django_settings

from dispatch.conf import default_settings

class DispatchSettings(object):

    COMBINE_SETTINGS = ('INSTALLED_APPS', 'STATICFILES_DIRS',)

    def configure(self):

        if django_settings.configured:
            # Abort if settings are already configured
            return

        project_settings = {}

        try:
            PROJECT_SETTINGS_MODULE = '%s.settings' % default_settings.DISPATCH_PROJECT_MODULE
            project_settings_module = __import__(PROJECT_SETTINGS_MODULE).settings

            # Add project settings
            for key in project_settings_module.__dict__:
                if not key.startswith('__'):
                    setting = getattr(project_settings_module, key)
                    if key in self.COMBINE_SETTINGS:
                        default_setting = getattr(default_settings, key)
                        project_settings[key] = default_setting + setting
                    else:
                        project_settings[key] = setting
        except:
            # Project settings not configured
            pass

        django_settings.configure(default_settings, **project_settings)

settings = DispatchSettings()

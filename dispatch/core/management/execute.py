from django.core.management import execute_from_command_line as dj_execute_from_command_line
from dispatch.conf import settings

def execute_from_command_line(argv=None):
    settings.configure()

    return dj_execute_from_command_line(argv)

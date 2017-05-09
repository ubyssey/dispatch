from dispatch.core.management import execute_from_command_line
from django.test import TestCase

class CommandLineTest(TestCase):

    def test_execute_from_command_line(self):

        execute_from_command_line(["manage.py", "check"])

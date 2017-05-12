from pkg_resources import get_distribution
from django.test import TestCase
import dispatch

class VersionTest(TestCase):

    def test_get_version(self):

        self.assertEqual(dispatch.__version__, get_distribution('dispatch').version)

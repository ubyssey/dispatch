from dispatch.core import wsgi
from django.test import TestCase

class wsgiTest(TestCase):

    def test_wsgi(self):

        return wsgi.get_wsgi_application()

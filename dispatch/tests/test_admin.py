from django.test import TestCase
from django.core.urlresolvers import reverse

class AdminTests(TestCase):
    def test_admin_index(self):
        """Load the admin index page"""

        response = self.client.get(reverse('dispatch-admin'))
        self.assertEqual(response.status_code, 200)

    def test_admin_child(self):
        """Load an admin child page"""

        url = reverse('dispatch-admin') + 'articles/1/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

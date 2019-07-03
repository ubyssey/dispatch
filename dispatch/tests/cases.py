import os
import shutil

from django.test import TestCase

from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token

from dispatch.models import User, Person

TEST_EMAIL = 'test@test.com'
TEST_PASSWORD = 'testing123'
TEST_SLUG = 'slug-123'
TEST_FULL_NAME = 'full name 123'

class DispatchAPITestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super(DispatchAPITestCase, cls).setUpClass()

        # Create dummy user for testing
        TEST_PERSON = Person.objects.create(full_name=TEST_FULL_NAME, slug=TEST_SLUG)
        user = User.objects.create_user(TEST_EMAIL, TEST_PASSWORD, 'admin', TEST_PERSON)
        (token, created) = Token.objects.get_or_create(user=user)

    def setUp(self):
        # Get user token
        user = User.objects.get(email=TEST_EMAIL)
        token = Token.objects.get(user_id=user.id)

        # Create new API Client instance
        self.client = APIClient()

        # Set user auth token header
        self.client.credentials(HTTP_AUTHORIZATION='Token %s' % token.key)

    def tearDown(self):
        super(DispatchAPITestCase, self).tearDown()

        # Call cleanup if it exists
        if hasattr(self, '_cleanup'):
            self._cleanup()

class DispatchMediaTestMixin(object):

    def _cleanup(self):
        # Clear the media directory
        try:
            shutil.rmtree(os.path.join(os.path.dirname(__file__), 'media'))
        except:
            pass

    def get_input_file(self, filename):
        return os.path.join(os.path.dirname(__file__), 'input', filename)

    def remove_input_file(self, filename):
        os.remove(self.get_input_file(filename))

    def fileExists(self, path):
        return os.path.exists(os.path.join(os.path.dirname(__file__), 'media', path))

from django.test import TestCase

from rest_framework.test import APIRequestFactory, APIClient
from rest_framework.authtoken.models import Token

from dispatch.apps.core.models import User

TEST_EMAIL = 'test@test.com'
TEST_PASSWORD = 'testing123'

class DispatchAPITestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super(DispatchAPITestCase, cls).setUpClass()

        # Create dummy user for testing
        user = User.objects.create_user(TEST_EMAIL, TEST_PASSWORD)
        (token, created) = Token.objects.get_or_create(user=user)

    def setUp(self):
        # Get user token
        user = User.objects.get(email=TEST_EMAIL)
        token = Token.objects.get(user_id=user.id)

        # Create new API Client instance
        self.client = APIClient()

        # Set user auth token header
        self.client.credentials(HTTP_AUTHORIZATION='Token %s' % token.key)

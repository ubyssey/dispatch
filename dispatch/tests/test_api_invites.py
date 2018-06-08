from rest_framework import status

from django.core.urlresolvers import reverse
from django.conf import settings
from django.contrib.auth import authenticate

from dispatch.models import Person, User
from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.test_api_persons import PersonsTests
from dispatch.tests.helpers import DispatchTestHelpers


TEST_USER_EMAIL = 'test_user@test.com'
TEST_USER_FULL_NAME = 'John Doe'

class InviteTests(DispatchAPITestCase):
    """A class to test the invite API methods"""

    def test_invite_creation(self):
        """Test simple person creation, checks the response and database"""
        pass
        response = DispatchTestHelpers.create_invite(
            self.client,
            email=TEST_USER_EMAIL
        )

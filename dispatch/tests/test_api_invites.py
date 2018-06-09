import datetime

from rest_framework import status

from django.core.urlresolvers import reverse
from django.conf import settings
from django.contrib.auth import authenticate

from dispatch.models import Person, User, Invite
from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.test_api_persons import PersonsTests
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.admin.forms import SignUpForm


TEST_USER_EMAIL = 'test_user@test.com'
TEST_USER_FULL_NAME = 'John Doe'

class InviteTests(DispatchAPITestCase):
    """A class to test the invite API methods"""

    def test_invite_creation(self):
        """Test simple person creation, checks the response and database"""

        response = DispatchTestHelpers.create_invite(
            self.client,
            email=TEST_USER_EMAIL
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(response.data['email'], TEST_USER_EMAIL)
        self.assertEqual(response.data['permissions'], '')

    def test_invite_url(self):
        """Test that the url generated in the invite is valid"""

        response = DispatchTestHelpers.create_invite(
            self.client, email=TEST_USER_EMAIL
        )

        invite = Invite.objects.get(id=response.data['id'])
        url = '%s%s' % (reverse('dispatch-signup'), str(invite.url))

        response = self.client.get(url, {}, format='html')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_signup(self):
        """Test that a user can sign up through the signup form and log in"""

        response = DispatchTestHelpers.create_invite(
            self.client, email=TEST_USER_EMAIL
        )

        invite = Invite.objects.get(id=response.data['id'])
        person = invite.person

        url = '%s%s' % (reverse('dispatch-signup'), str(invite.url))

        data = {
            'password1': 'acompliantpassword',
            'password2': 'acompliantpassword'
        }

        response = self.client.post(url, data)

        self.assertTrue(User.objects.filter(person=person).exists())

        url = reverse('api-token-list')

        data = {
            'email': 'test_user@test.com',
            'password': 'acompliantpassword'
        }

        response = self.client.post(url, data, format='json')
        self.assertIsNotNone(response.data.get("token"))
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

    def test_invite_expired(self):
        """Test that an invite no longer works after its expiry date"""
        response = DispatchTestHelpers.create_invite(
            self.client, email=TEST_USER_EMAIL
        )

        invite = Invite.objects.get(id=response.data['id'])

        invite.expiration_date = datetime.datetime.now() - datetime.timedelta(days=1)
        invite.save()

        url = '%s%s' % (reverse('dispatch-signup'), str(invite.url))

        response = self.client.get(url, {}, format='json')


        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

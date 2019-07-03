import datetime

from rest_framework import status

from django.urls import reverse
from django.conf import settings
from django.contrib.auth import authenticate

from dispatch.models import Person, User, Invite
from rest_framework.authtoken.models import Token

from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.test_api_persons import PersonsTests
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.admin.forms import SignUpForm


TEST_USER_EMAIL = 'test_user@test.com'
TEST_USER_FULL_NAME = 'John Doe'
TEST_USER_SLUG = 'john-doe'
TEST_USER_FULL_NAME_2 = 'John Doe The Second'
TEST_USER_SLUG_2 = 'john-doe-the-second'

class InviteTests(DispatchAPITestCase):
    """A class to test the invite API methods"""

    def test_invite_create_unauthorized(self):
        """Test that unauthorized users cannot send invites"""

        person_id = DispatchTestHelpers.create_person(self.client, full_name=TEST_USER_FULL_NAME, slug=TEST_USER_SLUG).data['id']

        self.client.credentials()

        url = reverse('api-invites-list')

        data = {
            'email': TEST_USER_EMAIL,
            'permissions': 'admin',
            'person': person_id
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(Invite.objects.filter(email=TEST_USER_EMAIL).exists())

    def test_invite_creation_unpermitted(self):
        """Test that users without the proper permissions cannot create invites"""

        user = DispatchTestHelpers.create_user(self.client, full_name='user', slug='user', email= 'nonAdminUser@test.com')

        person_id = DispatchTestHelpers.create_person(self.client, full_name=TEST_USER_FULL_NAME_2, slug=TEST_USER_SLUG_2).data['id']

        token, created = Token.objects.get_or_create(user_id=user.data['id'])

        self.client.credentials(HTTP_AUTHORIZATION='Token %s' % token.key)

        url = reverse('api-invites-list')

        data = {
            'email': TEST_USER_EMAIL,
            'permissions': 'admin',
            'person': person_id
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(Invite.objects.filter(email=TEST_USER_EMAIL).exists())

    def test_invite_creation(self):
        """Test simple invite creation, checks the response and database"""

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
        url = reverse('dispatch-signup', args=[str(invite.id)])

        response = self.client.get(url, {}, format='html')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_signup(self):
        """Test that a user can sign up through the signup form and log in"""

        response = DispatchTestHelpers.create_invite(
            self.client, email=TEST_USER_EMAIL
        )

        invite = Invite.objects.get(id=response.data['id'])
        person = invite.person

        url = reverse('dispatch-signup', args=[str(invite.id)])

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

        url = reverse('dispatch-signup', args=[str(invite.id)])

        response = self.client.get(url, {}, format='json')


        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

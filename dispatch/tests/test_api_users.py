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

class UserTests(DispatchAPITestCase):
    """A class to test the user API methods"""

    def test_user_creation(self):
        """Test simple person creation, checks the response and database"""

        response = DispatchTestHelpers.create_user(
            self.client,
            email=TEST_USER_EMAIL,
            full_name=TEST_USER_FULL_NAME
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(response.data['email'], TEST_USER_EMAIL)
        self.assertEqual(response.data['person']['full_name'], TEST_USER_FULL_NAME)

    def test_user_invalid_person(self):
        """Test to ensure user creation fails if wrong person ID is given"""

        response = DispatchTestHelpers.create_user(
            self.client,
            email=TEST_USER_EMAIL,
            person=123
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_duplicate_person(self):
        """Cannot associate a user with a person instance that already belongs to another user"""

        person_id = DispatchTestHelpers.create_person(self.client, TEST_USER_FULL_NAME).data['id']

        response = DispatchTestHelpers.create_user(
            self.client,
            email=TEST_USER_EMAIL,
            person=person_id
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = DispatchTestHelpers.create_user(
            self.client,
            email='test_user2@test.com',
            person=person_id
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_empty_user(self):
        """Creating an empty user should fail"""

        url = reverse('api-users-list')
        response = self.client.post(url, {}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_emails(self):
        """Creating a user with duplicate emails should fail"""

        response1 = DispatchTestHelpers.create_user(self.client, TEST_USER_EMAIL)
        response2 = DispatchTestHelpers.create_user(self.client, TEST_USER_EMAIL)

        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthorized_user_creation(self):
        """Test unauthorized user creation"""

        # Create person before clearing credentials
        person_id = DispatchTestHelpers.create_person(self.client, TEST_USER_FULL_NAME).data['id']

        self.client.credentials()

        url = reverse('api-users-list')

        data = {
            'email' : TEST_USER_EMAIL,
            'person' : person_id,
            'password_a': 'Matching',
            'password_b': 'NotMatching'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(User.objects.filter(email=TEST_USER_EMAIL).exists())

    def test_unauthorized_user_update(self):
        """Test unauthorized user update"""

        response = DispatchTestHelpers.create_user(self.client, TEST_USER_EMAIL)

        user_id = response.data['id']
        url = reverse('api-users-detail', args=[user_id])

        data = {
            'email' : 'newEmail@gmail.com'
        }

        self.client.credentials()

        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(User.objects.get(id=user_id).email, TEST_USER_EMAIL)

    def test_unauthorized_listing_get_request(self):
        """Test that an a get request for users listing without
        admin credentials results in a UNAUTHORIZED response"""

        self.client.credentials()

        url = reverse('api-users-list')

        response = self.client.get(url, {}, format='json')

        self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_detail_get_request(self):
        """Test that an a get request for users detail without
        admin credentials results in a UNAUTHORIZED response"""

        self.client.credentials()

        # Use the id == 1, default user created on database creation
        url = reverse('api-users-detail', args=[1])

        response = self.client.get(url, {}, format='json')

        self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_user_with_password(self):
        """Check that creating a user with a password works correctly"""

        # NOTE: By default _create_user() supplies a good password
        response = DispatchTestHelpers.create_user(self.client, TEST_USER_EMAIL)

        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

    def test_user_authentication(self):
        """Test that user authenticates"""

        response = DispatchTestHelpers.create_user(self.client, email=TEST_USER_EMAIL, password='TheBestPassword!')

        user = authenticate(username=TEST_USER_EMAIL, password='TheBestPassword!')

        self.assertIsNotNone(user)

    def test_bad_passwords(self):
        """A test case to ensure a variety of bad passwords are not succesful"""

        person_id = DispatchTestHelpers.create_person(self.client, TEST_USER_FULL_NAME).data['id']

        url = reverse('api-users-list')

        data = {
            'email' : 'testemail123@ubyssey.ca',
            'person' : person_id
        }

        # Not matching
        data['password_a'] = 'matching'
        data['password_b'] = 'notmatching'
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Too short
        data['password_a'] = 'short'
        data['password_b'] = 'short'
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Too common
        data['password_a'] = 'password'
        data['password_b'] = 'password'
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

        # All numerics
        data['password_a'] = '12345654321'
        data['password_b'] = '12345654321'
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_update(self):
        """Ensure that user updates works correctly"""

        response = DispatchTestHelpers.create_user(self.client, TEST_USER_EMAIL)

        UPDATED_EMAIL = 'updateTest@gmail.com'
        UPDATED_PASSWORD = 'updatedPassword'

        url = reverse('api-users-detail', args=[response.data['id']])

        data = {
            'email' : UPDATED_EMAIL,
            'password_a' : UPDATED_PASSWORD,
            'password_b' : UPDATED_PASSWORD
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], UPDATED_EMAIL)

        user = User.objects.get(pk=response.data['id'])

        self.assertEqual(user.email, UPDATED_EMAIL)
        self.assertTrue(user.check_password(UPDATED_PASSWORD))

    def test_delete_user(self):
        """Simple user deletion test"""

        response = DispatchTestHelpers.create_user(
            self.client,
            email=TEST_USER_EMAIL,
            full_name=TEST_USER_FULL_NAME
        )

        user_id = response.data['id']
        person_id = response.data['person']['id']

        # Generate detail URL
        url = reverse('api-users-detail', args=[user_id])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(id=user_id).exists())

        # Can't delete an user that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Check that attached person is not deleted
        url = reverse('api-persons-detail', args=[person_id])
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Person.objects.filter(id=person_id).exists())


    def test_unauthorized_user_deletion(self):
        """Unauthorized deletion of a user isn't allowed"""

        response = DispatchTestHelpers.create_user(
            self.client,
            email=TEST_USER_EMAIL
        )

        url = reverse('api-users-detail', args=[response.data['id']])

        self.client.credentials()

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_authorized_user(self):
        """Test that retrieving the user model for the authenticated user works as expected"""

        user = User.objects.get(email='test@test.com')

        url = reverse('api-users-detail', args=['me'])
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(user.id, response.data['id'])

    def test_retrieve_authorized_user_when_unauthenticated(self):
        """Test that the users/me api route does not work when unauthenticated"""

        self.client.credentials()

        url = reverse('api-users-detail', args=['me'])
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

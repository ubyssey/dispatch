from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.apps.content.models import Person, User
from django.core.urlresolvers import reverse
from rest_framework import status
from django.conf import settings
from test_api_persons import PersonsTests

class UserTests(DispatchAPITestCase):
    """A class to test the user API methods"""

    def test_user_creation(self):
        """Test simple person creation, checks the response and database"""

        response = self._create_user(email='test@gmail.com', full_name='Attached Person')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = User.objects.get(pk=response.data['id'])
        self.assertEqual(user.person.full_name, 'Attached Person')

    def test_user_creation_fail(self):
        """Test to ensure user creation fails if wrong person ID is given"""
        response = self._create_user(email="test@gmail.com", person_id=123)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_empty_user(self):
        """Creating an empty user should fail"""
        url = reverse('api-users-list')
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_emails(self):
        """Creating a user with duplicate emails should fail"""
        response1 = self._create_user('test@gmail.com')
        response2 = self._create_user('test@gmail.com')

        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.status_code, status.HTTP_409_CONFLICT)

    def test_unauthorized_user_creation(self):
        """Test unauthorized user creation"""
        #NOTE: Can't use helper method here, credential clear will break _create_person
        person_id = self._create_person("Attached Person").data['id']

        self.client.credentials()
        url = reverse('api-users-list')
        data = {
            'email' : 'testemail123@ubyssey.ca',
            'person_id' : person_id,
            'password_a': 'Matching',
            'password_b': 'NotMatching'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_user_update(self):
        """Test unauthorized user update"""
        response = self._create_user('test@gmail.com')

        url = reverse('api-users-detail', args=[response.data['id']])
        data = {
            'email' : 'newEmail@gmail.com'
        }
        self.client.credentials()
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

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
        response = self._create_user("test@ubyssey.ca")

        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

    def test_bad_passords(self):
        """A test case to ensure a variety of bad passwords are not succesful"""
        person_id = self._create_person("Attached Person").data['id']
        url = reverse('api-users-list')
        data = {
            'email' : 'testemail123@ubyssey.ca',
            'person_id' : person_id,
            'password_a': 'Matching',
            'password_b': 'NotMatching'
        }
        # PASSWORD TESTS

        # Not matching
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
        response = self._create_user('test@ubyssey.ca')

        UPDATED_EMAIL = 'updateTest@gmail.com'
        UPDATED_PASSWORD = 'updatedPassword'

        url = reverse('api-users-detail', args=[response.data['id']])
        data = {
            'email' : UPDATED_EMAIL,
            'password_a' : UPDATED_PASSWORD,
            'password_b' : UPDATED_PASSWORD
        }
        #TODO: Figure out how to test that password is updating
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.data['email'], UPDATED_EMAIL)

        user = User.objects.get(pk=response.data['id'])
        self.assertEqual(user.email, UPDATED_EMAIL)

    def test_delete_user(self):
        """Simple user deletion test"""

        response = self._create_user(
            email='test@gmail.com',
            full_name='Attached Person'
        )
        user_id = response.data['id']
        person_id = response.data['person_id']
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

        response = self._create_user(
            email='test@gmail.com'
        )
        url = reverse('api-users-detail', args=[response.data['id']])
        self.client.credentials()
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def _create_user(self, email, full_name='Attached Person', person_id=None):
        """
        A helper method that creates a simple user object with the given attributes
        and returns the response
        """

        person_id = person_id or self._create_person(full_name).data['id']
        url = reverse('api-users-list')
        data = {
            'email' : email,
            'person_id' : person_id,
            'password_a': 'TheBestPassword',
            'password_b': 'TheBestPassword'
        }

        return self.client.post(url, data, format='json')

    def _create_person(self, full_name='', image='', slug='', description=''):
        """A helper method that creates a simple person object with the given attributes
        and returns the response"""

        url = reverse('api-persons-list')

        data = {
            'full_name': full_name,
            'image': image,
            'slug': slug,
            "description": description
        }
        return self.client.post(url, data, format='multipart')
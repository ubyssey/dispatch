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

        # Create a person to attach user to
        personResponse = self._create_person("Second Person")
        self.assertEqual(personResponse.status_code, status.HTTP_201_CREATED)

        # Attach user
        response = self._create_user("arash.out@gmail.com", 2)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = User.objects.get(pk=response.data['id'])

    def test_unauthorized_listing_get_request(self):
        """Test that an a get request for users listing without
        admin credentials results in a UNAUTHORIZED response"""

        self.client.credentials()

        url = reverse('api-users-list')

        response = self.client.get(url, {}, format='json')
        print response

        self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # def test_unauthorized_detail_get_request(self):
    #     """Test that an a get request for users detail without
    #     admin credentials results in a UNAUTHORIZED response"""

    #     self.client.credentials()

    #     # Use the id == 1, default user created on database creation
    #     url = reverse('api-users-detail', args=[1])

    #     response = self.client.get(url, {}, format='json')

    #     self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def _create_user(self, email, person_id):
        """
        A helper method that creates a simple user object with the given attributes
        and returns the response
        """

        url = reverse('api-users-list')

        data = {
            'email' : email,
            'person_id' : person_id
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

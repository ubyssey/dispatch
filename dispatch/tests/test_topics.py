from django.core.urlresolvers import reverse
from rest_framework import status
from dispatch.tests.cases import DispatchAPITestCase
from dispatch.apps.content.models import Topic

class TopicsTests(DispatchAPITestCase):

    def _create_topic(self):
        """Create a dummy topic instance"""

        data = {
            'name': 'testing topic'
        }

        url = reverse('api-topics-list')

        return self.client.post(url, data, format='json')

    def test_create_topic_unauthorized(self):
        """
        Create topic should fail with unauthenticated request
        """

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-topics-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_empty_topic(self):
        """
        Create topic should fail with empty payload
        """

        url = reverse('api-topics-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_incomplete_topic(self):
        """
        Create topic should fail with missing required fields
        """

        url = reverse('api-topics-list')

        # topic data is missing name
        data = {

        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertTrue('name' in response.data)

    def test_create_topic(self):
        """
        Ensure that topic can be created
        """

        response = self._create_topic()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check data
        self.assertEqual(response.data['name'], 'testing topic')

    def test_delete_topic_unauthorized(self):
        """
        Delete topic should fail with unauthenticated request
        """

        # Create an topic
        topic = self._create_topic()

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-topics-detail', args=[topic.data['id']])

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_topic(self):
        """
        Ensure that topic can be deleted
        """

        topic = self._create_topic()

        # Generate detail URL
        url = reverse('api-topics-detail', args=[topic.data['id']])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Can't delete an topic that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

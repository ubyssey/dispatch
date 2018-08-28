from rest_framework import status

from django.urls import reverse

from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.models import Topic

class TopicsTests(DispatchAPITestCase):

    def test_create_topic_unauthorized(self):
        """Create topic should fail with unauthenticated request"""

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-topics-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_empty_topic(self):
        """Create topic should fail with empty payload"""

        url = reverse('api-topics-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_incomplete_topic(self):
        """Create topic should fail with missing required fields"""

        url = reverse('api-topics-list')

        # topic data is missing name
        data = {}

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertTrue('name' in response.data)

    def test_create_topic(self):
        """Ensure that topic can be created"""

        response = DispatchTestHelpers.create_topic(self.client, 'Test Topic')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Test Topic')

    def test_delete_topic_unauthorized(self):
        """Delete topic should fail with unauthenticated request"""

        topic = DispatchTestHelpers.create_topic(self.client, 'Test Topic')

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-topics-detail', args=[topic.data['id']])

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_topic(self):
        """Ensure that topic can be deleted"""

        topic = DispatchTestHelpers.create_topic(self.client, 'Test Topic')

        url = reverse('api-topics-detail', args=[topic.data['id']])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Can't delete an topic that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

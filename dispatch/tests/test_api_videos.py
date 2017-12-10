from rest_framework import status

from django.core.urlresolvers import reverse

from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.models import Video

class VideosTests(DispatchAPITestCase):

    def test_create_video_unauthorized(self):
        """Create video should fail with unauthenticated request"""

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-videos-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_empty_video(self):
        """Create video should fail with empty payload"""

        url = reverse('api-videos-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_incomplete_video(self):
        """Create video should fail with missing required fields"""

        url = reverse('api-videos-list')

        # video data is missing url
        data = {
            'title': 'test',
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertTrue('url' in response.data)

    def test_create_video(self):
        """Ensure that video can be created"""

        response = DispatchTestHelpers.create_video(self.client, 'testVideo')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'testVideo')

    def test_delete_video_unauthorized(self):
        """Delete video should fail with unauthenticaed request"""

        video = DispatchTestHelpers.create_video(self.client, 'testVideo')

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-videos-detail', args=[video.data['id']])

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_video(self):
        """Ensure that video can be deleted"""

        video = DispatchTestHelpers.create_video(self.client, 'testVideo')

        url = reverse('api-videos-detail', args=[video.data['id']])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Can't delete a video that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

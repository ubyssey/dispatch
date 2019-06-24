from rest_framework import status

from django.urls import reverse

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

    def test_create_tricky_video(self):
        """Ensure that authors get displayed even when they are on the second page"""

        response = DispatchTestHelpers.create_tricky_video(self.client, 'testVideo')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'testVideo')
        self.assertEqual(len(list(response.data['authors'])), 2)

        url = reverse('api-videos-detail', args=[response.data['id']])
        getVideoResponse = self.client.get(url, format='json')
        self.assertEqual(getVideoResponse.status_code, status.HTTP_200_OK)
        self.assertEqual(getVideoResponse.data['title'], 'testVideo')
        self.assertEqual(len(list(getVideoResponse.data['authors'])), 2)

        getVideoAgainResponse = self.client.get(url, format='json')
        self.assertEqual(getVideoAgainResponse.status_code, status.HTTP_200_OK)
        self.assertEqual(getVideoAgainResponse.data['title'], 'testVideo')
        self.assertEqual(len(list(getVideoAgainResponse.data['authors'])), 2)

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

    def test_update_video(self):
        """Ensure that video can be updated"""
        createVideoResponse = DispatchTestHelpers.create_video(self.client, 'testVideo')
        videoId = createVideoResponse.data['id']
        updatedTitle = 'updatedTitle'
        updateVideoTitleResponse = DispatchTestHelpers.update_video(self.client, videoId=videoId, updatedProperty='title', value=updatedTitle)

        # Successful updation should return 200
        self.assertEqual(updateVideoTitleResponse.status_code, status.HTTP_200_OK)
        self.assertEqual(updateVideoTitleResponse.data['title'], updatedTitle)
        
        # Update url
        updatedUrl = 'updatedUrl'
        updateVideoUrlResponse = DispatchTestHelpers.update_video(self.client, videoId=videoId, updatedProperty='url', value=updatedUrl)
        self.assertEqual(updateVideoUrlResponse.status_code, status.HTTP_200_OK)
        self.assertEqual(updateVideoUrlResponse.data['url'], updatedUrl)
        
        # Update authors
        self.assertEqual(len(list(createVideoResponse.data['authors'])), 1)
        updateVideoAuthorsResponse = DispatchTestHelpers.update_video(self.client, videoId=videoId, updatedProperty='author_ids')
        self.assertEqual(updateVideoAuthorsResponse.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list(updateVideoAuthorsResponse.data['authors'])), 3)
        
        # Delete updated video
        url = reverse('api-videos-detail', args=[videoId])
        deleteVideoResponse = self.client.delete(url, format='json')
        self.assertEqual(deleteVideoResponse.status_code, status.HTTP_204_NO_CONTENT)


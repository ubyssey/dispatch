import os
import shutil
import datetime
import StringIO

from rest_framework import status

from django.core.urlresolvers import reverse

from dispatch.tests.cases import DispatchAPITestCase


class FileTests(DispatchAPITestCase):

    def _upload_file(self):
        """
        Upload a test file to server
        """
        url = reverse('api-files-list')

        test_file = StringIO.StringIO('testtesttest')

        data = {
            'name': 'TestFile',
            'file': test_file
        }

        response = self.client.post(url, data, format='multipart')

        test_file.close()

        return response

    def _cleanup(self):
        """
        Delete created files and remove directory
        """
        shutil.rmtree(os.path.join(os.path.dirname(__file__), 'media'))

    def test_upload_file_unauthorized(self):
        """
        File upload should fail with unauthenticated request
        """
        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-files-list')

        response = self.client.post(url, None, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_upload_file(self):
        """
        Upload test file
        """

        response = self._upload_file()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check data
        self.assertEqual(response.data['name'], 'TestFile')

        self._cleanup()

    def test_delete_file(self):
        """
        Ensure file can be deleted
        """
        # upload a file
        file = self._upload_file()

        url = reverse('api-files-detail', args=[file.data['id']])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Can't delete an file that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        self._cleanup()


    def test_delete_file_unauthorized(self):
        """
        Delete file shoudl fail with unauthenticated request
        """
        # Upload a file
        file = self._upload_file()

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-files-detail', args=[file.data['id']])

        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

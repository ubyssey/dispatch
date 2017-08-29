from rest_framework import status

from django.core.urlresolvers import reverse

from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.models import Tag

class TagsTests(DispatchAPITestCase):

    def test_create_tag_unauthorized(self):
        """Create tag should fail with unauthenticated request"""

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-tags-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_empty_tag(self):
        """Create tag should fail with empty payload"""

        url = reverse('api-tags-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_incomplete_tag(self):
        """Create tag should fail with missing required fields"""

        url = reverse('api-tags-list')

        # tag data is missing name
        data = {}

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertTrue('name' in response.data)

    def test_create_tag(self):
        """Ensure that tag can be created"""

        response = DispatchTestHelpers.create_tag(self.client, 'testTag')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'testTag')

    def test_delete_tag_unauthorized(self):
        """Delete tag should fail with unauthenticated request"""

        tag = DispatchTestHelpers.create_tag(self.client, 'testTag')

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-tags-detail', args=[tag.data['id']])

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_tag(self):
        """Ensure that tag can be deleted"""

        tag = DispatchTestHelpers.create_tag(self.client, 'testTag')

        url = reverse('api-tags-detail', args=[tag.data['id']])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Can't delete an tag that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

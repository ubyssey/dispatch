from django.urls import reverse

from rest_framework import status

from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.models import ImageGallery

class ImageGalleryTests(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_imagegallery_all(self):
        """Test that listing all the galleries works"""

        # insert 2 galleries
        gallery1, img_1_a, img_1_b = DispatchTestHelpers.create_gallery(0, self.client)
        gallery2, img_2_a, img_2_b = DispatchTestHelpers.create_gallery(1, self.client)

        url = reverse('api-galleries-list')
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)


        # Check that the the returned data is correct
        def checkOneGallery(id, img_id1, img_id2):
            self.assertEqual(response.data['results'][id]['title'], 'Gallery Title %d' % id)
            self.assertEqual(response.data['results'][id]['images'][0]['caption'], 'test caption 1')
            self.assertEqual(response.data['results'][id]['images'][0]['credit'], 'test credit 1')
            self.assertEqual(response.data['results'][id]['images'][0]['image']['id'], img_id1)
            self.assertEqual(response.data['results'][id]['images'][1]['caption'], 'test caption 2')
            self.assertEqual(response.data['results'][id]['images'][1]['credit'], 'test credit 2')
            self.assertEqual(response.data['results'][id]['images'][1]['image']['id'], img_id2)

        checkOneGallery(0, img_1_a.data['id'], img_1_b.data['id'])
        checkOneGallery(1, img_2_a.data['id'], img_2_b.data['id'])

    def test_imagegallery_get(self):
        """Test that getting a specific gallery works"""

        gallery, img_1, img_2 = DispatchTestHelpers.create_gallery(1, self.client)

        id = gallery.data['id']
        url = reverse('api-galleries-detail', args=[id])

        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data['title'], 'Gallery Title 1')
        self.assertEqual(response.data['images'][0]['caption'], 'test caption 1')
        self.assertEqual(response.data['images'][0]['image']['id'], img_1.data['id'])
        self.assertEqual(response.data['images'][1]['caption'], 'test caption 2')
        self.assertEqual(response.data['images'][1]['image']['id'], img_2.data['id'])

    def test_imagegallery_get_invalid_id(self):
        """Test that getting an invalid id returns appropriate error"""

        id = -1
        url = reverse('api-galleries-detail', args=[id])
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_imagegallery_create_unauthorized(self):
        """Create gallery should fail with unauthenticated request"""

        url = reverse('api-galleries-list')
        image = DispatchTestHelpers.create_image(self.client)

        # Clear authentication credentials (after uploading the image)
        self.client.credentials()

        data = {
            'title': 'Gallery Title',
            'attachment_json': {
                'caption': 'test caption 1',
                'credit': 'test credit 1',
                'image_id': image.data['id']
            }
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Check that nothing was added
        count = ImageGallery.objects.count()
        self.assertEqual(count, 0)

    def test_imagegallery_create_empty(self):
        """Create empty gallery should result in an empty gallery"""

        url = reverse('api-galleries-list')

        data = {
          'title': 'Gallery Title'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        id = response.data['id']
        url = reverse('api-galleries-detail', args=[id])
        response = self.client.get(url, format='json')

        self.assertEqual(len(response.data['images']), 0)

    def test_imagegallery_create(self):
        """Ensure that gallery can be created"""

        gallery, img_1, img_2 = DispatchTestHelpers.create_gallery(1, self.client)

        id = gallery.data['id']
        url = reverse('api-galleries-detail', args=[id])
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data['title'], 'Gallery Title 1')
        self.assertEqual(response.data['images'][0]['caption'], 'test caption 1')
        self.assertEqual(response.data['images'][0]['credit'], 'test credit 1')
        self.assertEqual(response.data['images'][0]['image']['id'], img_1.data['id'])
        self.assertEqual(response.data['images'][1]['caption'], 'test caption 2')
        self.assertEqual(response.data['images'][1]['credit'], 'test credit 2')
        self.assertEqual(response.data['images'][1]['image']['id'], img_2.data['id'])

    def test_imagegallery_create_invalid_image_ids(self):
        """Ensure that an appropriate error is returned when an image gallery is
        created with an invalid image id"""

        url = reverse('api-galleries-list')

        data = {
          'title': 'Gallery Title',
          'attachment_json': [
            {
              'caption': 'test caption 1',
              'credit': 'test credit 1',
              'image_id': -1
            }
          ]
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_imagegallery_create_no_image_ids(self):
        """Ensure that an appropriate error is returned when an image gallery is
        created with an invalid image id"""

        url = reverse('api-galleries-list')

        data = {
          'title': 'Gallery Title',
          'attachment_json': [
            {
              'caption': 'test caption 1',
              'credit': 'test credit 1'
            }
          ]
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_imagegallery_patch_unauthorized(self):
        """Patch gallery should fail with unauthenticated request"""

        gallery, img_1, img_2 = DispatchTestHelpers.create_gallery(1, self.client)

        id = gallery.data['id']

        # Clear authentication credentials
        self.client.credentials()

        data = {
          'title': 'New Gallery Title',
          'attachment_json': [
            {
              'caption': 'test caption 1',
              'credit': 'test credit 1',
              'image_id': img_1.data['id']
            }
          ]
        }

        url = reverse('api-galleries-detail', args=[id])
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Ensure the data wasn't actually changed
        response = self.client.get(url, format='json')
        self.assertEqual(response.data['title'], 'Gallery Title 1')
        self.assertEqual(response.data['images'][0]['caption'], 'test caption 1')
        self.assertEqual(response.data['images'][0]['credit'], 'test credit 1')
        self.assertEqual(response.data['images'][0]['image']['id'], img_1.data['id'])
        self.assertEqual(response.data['images'][1]['caption'], 'test caption 2')
        self.assertEqual(response.data['images'][1]['credit'], 'test credit 2')
        self.assertEqual(response.data['images'][1]['image']['id'], img_2.data['id'])

    def test_imagegallery_patch_single(self):
        """Ensure that patching a single gallery works"""

        gallery, img_1, img_2 = DispatchTestHelpers.create_gallery(1, self.client)

        id = gallery.data['id']
        url = reverse('api-galleries-detail', args=[id])

        data = {
          'title': 'New Gallery Title',
          'attachment_json': [
            {
              'caption': 'new test caption 1',
              'credit': 'new test credit 1',
              'image_id': img_2.data['id']
            },
            {
              'caption': 'new test caption 2',
              'credit': 'new test credit 2',
              'image_id': img_1.data['id']
            }
          ]
        }

        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        url = reverse('api-galleries-detail', args=[id])
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the data was updated
        self.assertEqual(response.data['title'], 'New Gallery Title')
        self.assertEqual(response.data['images'][0]['caption'], 'new test caption 1')
        self.assertEqual(response.data['images'][0]['credit'], 'new test credit 1')
        self.assertEqual(response.data['images'][0]['image']['id'], img_2.data['id'])
        self.assertEqual(response.data['images'][1]['caption'], 'new test caption 2')
        self.assertEqual(response.data['images'][1]['credit'], 'new test credit 2')
        self.assertEqual(response.data['images'][1]['image']['id'], img_1.data['id'])

    def test_imagegallery_patch_invalid_id(self):
        """Ensure that patching invalid id returns the appropriate error"""

        id = -1
        url = reverse('api-galleries-detail', args=[id])
        response = self.client.patch(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_imagegallery_patch_invalid_image_ids(self):
        """Ensure that an appropriate error is returned when an image gallery is
        patched with an invalid image id"""

        gallery, img_1, img_2 = DispatchTestHelpers.create_gallery(1, self.client)
        id = gallery.data['id']

        url = reverse('api-galleries-detail', args=[id])

        data = {
            'title': 'New Gallery Ttile',
            'attachment_json': [
                {
                    'caption': 'new test caption',
                    'credit': 'new test credit',
                    'image_id': -1
                }
            ]
        }

        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_imagegallery_patch_no_image_ids(self):
        """Ensure that an appropriate error is returned when an image gallery is
        patched with an invalid image id"""

        gallery, img_1, img_2 = DispatchTestHelpers.create_gallery(1, self.client)
        id = gallery.data['id']

        url = reverse('api-galleries-detail', args=[id])

        data = {
            'title': 'New Gallery Title',
            'attachment_json': [
                {
                    'caption': 'new test caption',
                    'credit': 'new test credit'
                }
            ]
        }

        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_imagegallery_delete_unauthorized(self):
        """Delete gallery should fail with unauthenticated request"""

        gallery, img_1, img_2 = DispatchTestHelpers.create_gallery(1, self.client)
        id = gallery.data['id']

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-galleries-detail', args=[id])
        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        try:
            ImageGallery.objects.get(pk=id)
        except ImageGallery.DoesNotExist:
            self.fail('The gallery should not have been deleted')

    def test_imagegallery_delete(self):
        """Ensure that galleries can be deleted"""

        gallery, img_1, img_2 = DispatchTestHelpers.create_gallery(1, self.client)
        id = gallery.data['id']

        url = reverse('api-galleries-detail', args=[id])
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Check that the gallery is gone
        url = reverse('api-galleries-detail', args=[id])
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_imagegallery_delete_invalid_id(self):
        """Ensure that deleting invalid id returns the appropriate error"""

        id = -1
        url = reverse('api-galleries-detail', args=[id])
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_image_in_multiple_galleries(self):
        """Ensure that an image can be in multiple galleries"""

        gallery1, img_1, img_2 = DispatchTestHelpers.create_gallery(1, self.client)

        url = reverse('api-galleries-list')

        data = {
            'title': 'New Gallery Title',
            'attachment_json': [
                {
                    'caption': 'test caption 1',
                    'credit': 'test credit 1',
                    'image_id': img_1.data['id']
                },
                {
                    'caption': 'test caption 2',
                    'credit': 'test credit 2',
                    'image_id': img_2.data['id']
                }
            ]
        }

        gallery2 = self.client.post(url, data, format='json')
        self.assertEqual(gallery2.status_code, status.HTTP_201_CREATED)

        id2 = gallery2.data['id']
        url = reverse('api-galleries-detail', args=[id2])
        response = self.client.get(url, format='json')

        self.assertEqual(response.data['title'], 'New Gallery Title')
        self.assertEqual(response.data['images'][0]['caption'], 'test caption 1')
        self.assertEqual(response.data['images'][0]['credit'], 'test credit 1')
        self.assertEqual(response.data['images'][0]['image']['id'], img_1.data['id'])
        self.assertEqual(response.data['images'][1]['caption'], 'test caption 2')
        self.assertEqual(response.data['images'][1]['credit'], 'test credit 2')
        self.assertEqual(response.data['images'][1]['image']['id'], img_2.data['id'])

    def test_imagegallery_query(self):
        """Should be able to search for galleries by title"""

        # Create galleries
        DispatchTestHelpers.create_gallery(1, self.client)
        DispatchTestHelpers.create_gallery(2, self.client)
        DispatchTestHelpers.create_gallery(20, self.client)

        url = '%s?q=%s' % (reverse('api-galleries-list'), 'Title 2')

        response = self.client.get(url, format='json')

        data = response.data

        self.assertEqual(data['results'][0]['title'], 'Gallery Title 2')
        self.assertEqual(data['results'][1]['title'], 'Gallery Title 20')
        self.assertEqual(data['count'], 2)
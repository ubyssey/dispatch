from rest_framework import status

from django.core.urlresolvers import reverse

from dispatch.apps.content.models import Image, Person

from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin

class ImagesTests(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_upload_image_unauthorized(self):
        """
        Should not be able to upload an image without authorization.
        """

        # Clear client credentials
        self.client.credentials()

        with open(self._input('test_image.jpg')) as test_image:

            data = { 'img': test_image }

            url = reverse('api-images-list')

            response = self.client.post(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        images = Image.objects.all()

        self.assertEqual(len(images), 0)

    def test_upload_image_empty(self):
        """
        Should not be able to upload an empty image.
        """

        data = {}

        url = reverse('api-images-list')

        response = self.client.post(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        images = Image.objects.all()
        self.assertEqual(len(images), 0)

    def test_upload_image_jpeg(self):
        """
        Should be able to upload a JPEG image.
        """

        with open(self._input('test_image.jpg')) as test_image:

            data = { 'img': test_image }

            url = reverse('api-images-list')

            response = self.client.post(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(self.fileExists(response.data['url']))

        # Assert that resized versions were created
        self.assertTrue(self.fileExists(response.data['url_medium']))
        self.assertTrue(self.fileExists(response.data['url_thumb']))

    def test_upload_image_png(self):
        """
        Should be able to upload a PNG image.
        """

        with open(self._input('test_image.png')) as test_image:

            data = { 'img': test_image }

            url = reverse('api-images-list')

            response = self.client.post(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(self.fileExists(response.data['url']))

        # Assert that resized versions were created
        self.assertTrue(self.fileExists(response.data['url_medium']))
        self.assertTrue(self.fileExists(response.data['url_thumb']))

    def test_upload_duplicate_filenames(self):
        """
        Should be able to upload an image with the same filename as an existing image.
        """

        url = reverse('api-images-list')

        with open(self._input('test_image.jpg')) as test_image:
            image_1 = self.client.post(url, { 'img': test_image }, format='multipart')
            
        with open(self._input('test_image.jpg')) as test_image:
            image_2 = self.client.post(url, { 'img': test_image }, format='multipart')

        self.assertEqual(image_1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(image_2.status_code, status.HTTP_201_CREATED)

        self.assertTrue(self.fileExists(image_1.data['url']))
        self.assertTrue(self.fileExists(image_2.data['url']))

        # Check that filenames are different
        self.assertTrue(image_1.data['url'] != image_2.data['url'])

    def test_update_image_unauthorized(self):
        """
        Should not be able to update an image without authorization.
        """

        with open(self._input('test_image.jpg')) as test_image:

            data = { 'img': test_image }

            url = reverse('api-images-list')

            image = self.client.post(url, data, format='multipart')

        person = Person.objects.create(full_name='Test Person')

        # Clear client credentials
        self.client.credentials()

        new_data = {
            'title': 'Test image',
            'author_ids': [person.id]
        }

        url = reverse('api-images-detail', args=[image.data['id']])

        response = self.client.patch(url, new_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        image_instance = Image.objects.get(pk=image.data['id'])

        self.assertEqual(image_instance.title, None)
        self.assertEqual(len(image_instance.authors.all()), 0)

    def test_update_image(self):
        """
        Should be able to update an image.
        """

        with open(self._input('test_image.jpg')) as test_image:

            data = { 'img': test_image }

            url = reverse('api-images-list')

            image = self.client.post(url, data, format='multipart')

        person = Person.objects.create(full_name='Test Person')

        new_data = {
            'title': 'Test image',
            'author_ids': [person.id]
        }

        url = reverse('api-images-detail', args=[image.data['id']])

        response = self.client.patch(url, new_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test image')
        self.assertEqual(response.data['authors'][0]['full_name'], 'Test Person')

        image_instance = Image.objects.get(pk=image.data['id'])

        self.assertEqual(image_instance.title, 'Test image')
        self.assertEqual(image_instance.authors.all()[0].full_name, 'Test Person')

    def test_delete_image_unauthorized(self):
        """
        Should not be able to delete an image without authorization.
        """

        with open(self._input('test_image.jpg')) as test_image:

            data = { 'img': test_image }

            url = reverse('api-images-list')

            image = self.client.post(url, data, format='multipart')

        # Clear client credentials
        self.client.credentials()

        url = reverse('api-images-detail', args=[image.data['id']])

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue(self.fileExists(image.data['url']))

        try:
            Image.objects.get(pk=image.data['id'])
        except Image.DoesNotExist:
            self.fail('Image should not have been deleted')

    def test_delete_image(self):
        """
        Should be able to delete an image.
        """

        with open(self._input('test_image.jpg')) as test_image:

            data = { 'img': test_image }

            url = reverse('api-images-list')

            image = self.client.post(url, data, format='multipart')

        url = reverse('api-images-detail', args=[image.data['id']])

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(self.fileExists(image.data['url']))

        # Assert that resized versions were also deleted
        self.assertFalse(self.fileExists(image.data['url_medium']))
        self.assertFalse(self.fileExists(image.data['url_thumb']))

        try:
            Image.objects.get(pk=image.data['id'])
            self.fail('Image should have been deleted')
        except Image.DoesNotExist:
            pass


    def test_get_image(self):
        """
        Should be able to fetch an image by ID.
        """

        with open(self._input('test_image.jpg')) as test_image:

            data = { 'img': test_image }

            url = reverse('api-images-list')

            image = self.client.post(url, data, format='multipart')

        url = reverse('api-images-detail', args=[image.data['id']])

        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['url'], image.data['url'])

    def test_list_images(self):
        """
        Should be able to list all images.
        """

        url = reverse('api-images-list')

        # Upload three images
        with open(self._input('test_image.jpg')) as test_image:
            image_1 = self.client.post(url, { 'img': test_image }, format='multipart')

        with open(self._input('test_image.jpg')) as test_image:
            image_2 = self.client.post(url, { 'img': test_image }, format='multipart')

        with open(self._input('test_image.jpg')) as test_image:
            image_3 = self.client.post(url, { 'img': test_image }, format='multipart')

        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 3)
        self.assertEqual(response.data['results'][0]['filename'], image_1.data['filename'])
        self.assertEqual(response.data['results'][1]['filename'], image_2.data['filename'])
        self.assertEqual(response.data['results'][2]['filename'], image_3.data['filename'])

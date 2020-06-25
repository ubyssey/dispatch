#!/usr/bin/env python 
# -*- coding: utf-8 -*-

import sys
from importlib import reload
reload(sys)

from rest_framework import status

from django.urls import reverse

from dispatch.models import Image, Person, Tag

from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers

class ImagesTests(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_create_image_unauthorized(self):
        """Should not be able to upload an image without authorization."""

        # Clear client credentials
        self.client.credentials()
        response = DispatchTestHelpers.create_image(self.client)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Image.objects.count(), 0)

    def test_create_image_empty(self):
        """Should not be able to upload an empty image."""

        url = reverse('api-images-list')

        response = self.client.post(url, {}, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Image.objects.count(), 0)

    def test_create_image_no_authors(self):
        """Should not be able to create an image without authors."""

        url = reverse('api-images-list')

        with open(self.get_input_file('test_image_a.jpg'), 'rb') as test_image:
            response = self.client.post(url, { 'img': test_image }, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_image_jpeg(self):
        """Should be able to upload a JPEG image."""

        url = reverse('api-images-list')
        files = [
            'test_image_a.jpg',
            'test_image_b.JPG',
            'test_image_a.jpeg',
            'test_image_b.JPEG',
        ]

        for image_file in files:
            response = DispatchTestHelpers.create_image(self.client, filename=image_file)

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertTrue(self.fileExists(response.data['url']))

            # Assert that resized versions were created
            self.assertTrue(self.fileExists(response.data['url_medium']))
            self.assertTrue(self.fileExists(response.data['url_thumb']))

    def test_create_image_png(self):
        """Should be able to upload a PNG image."""

        url = reverse('api-images-list')
        files = [
            'test_image_a.png',
            'test_image_b.PNG',
        ]

        for image_file in files:
            response = DispatchTestHelpers.create_image(self.client, filename=image_file)

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertTrue(self.fileExists(response.data['url']))

            # Assert that resized versions were created
            self.assertTrue(self.fileExists(response.data['url_medium']))
            self.assertTrue(self.fileExists(response.data['url_thumb']))

    def test_upload_image_gif(self):
        """Should be able to upload a GIF image."""

        url = reverse('api-images-list')

        files = [
            'test_image_a.gif',
            'test_image_b.GIF',
        ]

        for image_file in files:
            response = DispatchTestHelpers.create_image(self.client, filename=image_file)

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertTrue(self.fileExists(response.data['url']))

            # Assert that resized versions were created
            self.assertTrue(self.fileExists(response.data['url_medium']))
            self.assertTrue(self.fileExists(response.data['url_thumb']))

    def test_upload_duplicate_filenames(self):
        """Should be able to upload an image with the same filename as an existing image."""

        url = reverse('api-images-list')

        image_1 = DispatchTestHelpers.create_image(self.client)
        image_2 = DispatchTestHelpers.create_image(self.client)

        self.assertEqual(image_1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(image_2.status_code, status.HTTP_201_CREATED)

        self.assertTrue(self.fileExists(image_1.data['url']))
        self.assertTrue(self.fileExists(image_2.data['url']))

        # Check that filenames are different
        self.assertTrue(image_1.data['url'] != image_2.data['url'])

    def test_create_image_invalid_filename(self):
        """Should not be able to upload image with non-ASCII characters in filename."""

        url = reverse('api-images-list')

        valid_filename = 'test_image_a.jpg'
        invalid_filename = 'test_image_bad_filename_é.jpg'

        with open(self.get_input_file(valid_filename), 'rb') as valid_image:
            with open(self.get_input_file(invalid_filename), 'wb') as invalid_image:
                invalid_image.writelines(valid_image.readlines())

        response = DispatchTestHelpers.create_image(self.client, filename=invalid_filename)

        self.remove_input_file(invalid_filename)

        self.assertEqual(response.status_code, status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
        self.assertEqual(response.data['detail'], 'The filename cannot contain non-ASCII characters')
        self.assertEqual(Image.objects.count(), 0)

    def test_update_image_unauthorized(self):
        """Should not be able to update an image without authorization."""

        image = DispatchTestHelpers.create_image(self.client)

        person = Person.objects.create(full_name='Some Test Person', slug='some-test-person')

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
        self.assertEqual(image_instance.authors.count(), 1)

    def test_update_image(self):
        """Should be able to update an image."""

        image = DispatchTestHelpers.create_image(self.client)
        TEST_PERSON_NAME = 'Random Test Person'
        TEST_PERSON_SLUG = 'random-test-person'

        person = Person.objects.create(full_name=TEST_PERSON_NAME, slug=TEST_PERSON_SLUG)

        new_data = {
            'title': 'Test image',
            'author_ids': [{'person': person.id, 'type': 'photographer'}]
        }

        url = reverse('api-images-detail', args=[image.data['id']])

        response = self.client.patch(url, new_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test image')
        self.assertEqual(response.data['authors'][0]['person']['full_name'], TEST_PERSON_NAME)

        image_instance = Image.objects.get(pk=image.data['id'])

        self.assertEqual(image_instance.title, 'Test image')
        self.assertEqual(image_instance.authors.all()[0].person.full_name, TEST_PERSON_NAME)

    def test_delete_image_unauthorized(self):
        """Should not be able to delete an image without authorization."""

        image = DispatchTestHelpers.create_image(self.client)

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
        """Should be able to delete an image."""

        image = DispatchTestHelpers.create_image(self.client)

        url = reverse('api-images-detail', args=[image.data['id']])

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        try:
            Image.objects.get(pk=image.data['id'])
            self.fail('Image should have been deleted')
        except Image.DoesNotExist:
            pass


    def test_get_image(self):
        """Should be able to fetch an image by ID."""
        image = DispatchTestHelpers.create_image(self.client)

        url = reverse('api-images-detail', args=[image.data['id']])

        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['url'], image.data['url'])

    def test_list_images(self):
        """Should be able to list all images."""

        # Upload three images
        image_1 = DispatchTestHelpers.create_image(self.client)
        image_2 = DispatchTestHelpers.create_image(self.client)
        image_3 = DispatchTestHelpers.create_image(self.client)

        url = reverse('api-images-list')
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 3)
        self.assertEqual(response.data['results'][0]['filename'], image_3.data['filename'])
        self.assertEqual(response.data['results'][1]['filename'], image_2.data['filename'])
        self.assertEqual(response.data['results'][2]['filename'], image_1.data['filename'])

    def test_tag_query(self):
        """Should be able to search images by tags"""

        tag = Tag.objects.create(name='Test Tag')

        filesa = [
            'test_image_a.jpg',
            'test_image_a.jpeg',
        ]
        filesb = [
            'test_image_b.JPG',
            'test_image_b.JPEG',
        ]

        new_data = {
            'tag_ids': [tag.id]
        }

        for image_file in filesa:
            image = DispatchTestHelpers.create_image(self.client, filename=image_file)
            imageurl = reverse('api-images-detail', args=[image.data['id']])
            response = self.client.patch(imageurl, new_data, format='json')

        for image_file in filesb:
           response = DispatchTestHelpers.create_image(self.client, filename=image_file)

        url = reverse('api-images-detail', args=[image.data['id']])

        response = self.client.patch(url, new_data, format='json')

        url = '%s?tags=%s' % (reverse('api-images-list'), tag.id)
        response = self.client.get(url, format='json')

        data = response.data

        self.assertEqual(data['count'], 2)
        self.assertEqual(data['results'][0]['filename'], 'test_image_a.jpeg')
        self.assertEqual(data['results'][1]['filename'], 'test_image_a.jpg')

    def test_author_query(self):
        """Should be able to search images by authors"""

        person = Person.objects.create(full_name='Ubyssey Person', slug='ubyssey-person')

        filesa = [
            'test_image_a.jpg',
            'test_image_a.jpeg',
        ]
        filesb = [
            'test_image_b.JPG',
            'test_image_b.JPEG',
        ]

        new_data = {
            'author_ids': [{'person': person.id, 'type': 'photographer'}]
        }

        for image_file in filesa:
            image = DispatchTestHelpers.create_image(self.client, filename=image_file)
            imageurl = reverse('api-images-detail', args=[image.data['id']])
            response = self.client.patch(imageurl, new_data, format='json')

        for image_file in filesb:
           response = DispatchTestHelpers.create_image(self.client, filename=image_file)

        url = reverse('api-images-detail', args=[image.data['id']])

        response = self.client.patch(url, new_data, format='json')

        url = '%s?author=%s' % (reverse('api-images-list'), person.id)
        response = self.client.get(url, format='json')

        data = response.data

        self.assertEqual(data['count'], 2)
        self.assertEqual(data['results'][0]['filename'], 'test_image_a.jpeg')
        self.assertEqual(data['results'][1]['filename'], 'test_image_a.jpg')

    def test_name_query(self):
        """Should be able to search images by name"""

        url = reverse('api-images-list')
        files = [
            'test_image_a.jpg',
            'test_image_b.JPG',
            'test_image_a.jpeg',
            'test_image_b.JPEG',
        ]
        filename = 'test_image_b'

        for image_file in files:
            response = DispatchTestHelpers.create_image(self.client, filename=image_file)

        url = '%s?q=%s' % (reverse('api-images-list'), filename)
        response = self.client.get(url, format='json')

        data = response.data

        self.assertEqual(data['results'][0]['filename'], 'test_image_b.jpeg')
        self.assertEqual(data['results'][1]['filename'], 'test_image_b.jpg')
        self.assertEqual(data['count'], 2)

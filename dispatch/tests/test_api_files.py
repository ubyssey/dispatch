#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
reload(sys)
sys.setdefaultencoding('utf8')

from rest_framework import status

from django.core.urlresolvers import reverse

from dispatch.models import File
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin

class FileTests(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_upload_file_unauthorized(self):
        """File upload should fail with unauthenticated request"""

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-files-list')

        response = self.client.post(url, None, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(File.objects.count(), 0)

    def test_upload_file(self):
        """Upload test file"""

        response = DispatchTestHelpers.upload_file(self.client)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'TestFile')
        self.assertTrue(self.fileExists(response.data['url']))

    def test_upload_file_invalid_filename(self):
        """Should not be able to upload file with non-ASCII characters in filename."""

        url = reverse('api-files-list')

        valid_filename = 'test_file.txt'
        invalid_filename = 'test_file_bad_filename_é.txt'

        with open(self.get_input_file(valid_filename)) as valid_file:
            with open(self.get_input_file(invalid_filename), 'w') as invalid_file:
                invalid_file.writelines(valid_file.readlines())

        with open(self.get_input_file(invalid_filename)) as test_file:
            response = self.client.post(url, { 'file': test_file }, format='multipart')

        self.remove_input_file(invalid_filename)

        self.assertEqual(response.status_code, status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
        self.assertEqual(response.data['detail'], 'The filename cannot contain non-ASCII characters')
        self.assertEqual(File.objects.count(), 0)

    def test_delete_file(self):
        """Ensure file can be deleted"""
        # upload a file
        file = DispatchTestHelpers.upload_file(self.client)

        url = reverse('api-files-detail', args=[file.data['id']])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        try:
            File.objects.get(pk=file.data['id'])
            self.fail('File should have been deleted')
        except File.DoesNotExist:
            pass

        # Can't delete an file that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_file_unauthorized(self):
        """Delete file should fail with unauthenticated request"""
        # Upload a file
        file = DispatchTestHelpers.upload_file(self.client)

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-files-detail', args=[file.data['id']])

        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        try:
            File.objects.get(pk=file.data['id'])
        except File.DoesNotExist:
            self.fail('File should not have been deleted')
    
    def test_name_query(self):
        """Should be able to search files by name"""
        
        fileA  = DispatchTestHelpers.upload_file(self.client, 'test_file_a')
        fileB  = DispatchTestHelpers.upload_file(self.client, 'test_file_b')

        url = '%s?q=%s' % (reverse('api-files-list'), fileA.data['name'])
        response = self.client.get(url, format='json')
        data = response.data

        self.assertEqual(data['results'][0]['name'], 'test_file_a')
        self.assertEqual(data['count'], 1)

        url = '%s?q=%s' % (reverse('api-files-list'), fileB.data['name'])
        response = self.client.get(url, format='json')
        data = response.data
        
        self.assertEqual(data['results'][0]['name'], 'test_file_b')
        self.assertEqual(data['count'], 1)

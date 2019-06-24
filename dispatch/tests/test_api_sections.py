from django.urls import reverse

from rest_framework import status

from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.models import Section

class SectionsTests(DispatchAPITestCase):

    def test_create_section_unauthorized(self):
        """Create section should fail with unauthenticated request"""

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-sections-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_empty_section(self):
        """Create section should fail with empty payload"""

        url = reverse('api-sections-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_incomplete_section(self):
        """Create section should fail with missing required fields"""

        url = reverse('api-sections-list')

        # Section data is missing slug
        data = {
            'name': 'test',
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertTrue('slug' in response.data)

    def test_create_section(self):
        """Ensure that section can be created"""

        response = DispatchTestHelpers.create_section(self.client)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check data
        self.assertEqual(response.data['name'], 'Test Section')
        self.assertEqual(response.data['slug'], 'test-section')
        
        url = reverse('dispatch-admin') + 'sections/' + str(response.data['id'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_create_duplicate_section(self):
        """Create duplication section should fail"""

        # Create section
        response = DispatchTestHelpers.create_section(self.client)

        # Confirm section was created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Create section again
        response = DispatchTestHelpers.create_section(self.client)

        # Confirm creating duplicate section returns error
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_section(self):
        """Ensure that section can be updated"""

        section = DispatchTestHelpers.create_section(self.client)

        # Check data
        self.assertEqual(section.data['name'], 'Test Section')
        self.assertEqual(section.data['slug'], 'test-section')

        data = {
            'name': 'new name',
            'slug': 'new-slug',
        }

        url = reverse('api-sections-detail', args=[section.data['id']])

        updated_section = self.client.patch(url, data, format='json')

        self.assertEqual(updated_section.data['name'], 'new name')
        self.assertEqual(updated_section.data['slug'], 'new-slug')

    def test_delete_section_unauthorized(self):
        """Delete section should fail with unauthenticated request"""

        # Create a section
        section = DispatchTestHelpers.create_section(self.client)

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-sections-detail', args=[section.data['id']])

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        try:
            Section.objects.get(pk=section.data['id'])
        except Section.DoesNotExist:
            self.fail('Section should not have been deleted')

    def test_delete_section(self):
        """Ensure that section can be deleted"""

        section = DispatchTestHelpers.create_section(self.client)

        # Generate detail URL
        url = reverse('api-sections-detail', args=[section.data['id']])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Can't delete a section that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_all_sections(self):
        """Ensure that it is possible to get all sections"""

        # Create multiple sections
        Section.objects.create(slug='section-1', name='Section 1')
        Section.objects.create(slug='section-2', name='Section 2')
        Section.objects.create(slug='section-3', name='Section 3')

        url = reverse('api-sections-list')

        response = self.client.get(url, format='json')

        # Check that all sections are returned
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 3)
        self.assertEqual(response.data['results'][0]['slug'], 'section-1')
        self.assertEqual(response.data['results'][1]['slug'], 'section-2')
        self.assertEqual(response.data['results'][2]['slug'], 'section-3')

    def test_get_specific_section(self):
        """Ensure that it is possible to get a specific section"""

        # Create multiple sections
        section_1 = Section.objects.create(slug='section-1', name='Section 1')
        section_2 = Section.objects.create(slug='section-2', name='Section 2')
        section_3 = Section.objects.create(slug='section-3', name='Section 3')

        url = reverse('api-sections-detail', args=[section_2.pk])

        response = self.client.get(url, format='json')

        # Check that section 2 is returned
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['slug'], 'section-2')

    def test_section_query(self):
        """Be able to search for sections"""

        # Create sections
        DispatchTestHelpers.create_section(self.client, 'news', 'news-slug')
        DispatchTestHelpers.create_section(self.client, 'some News', 'some-news-slug')
        DispatchTestHelpers.create_section(self.client, 'science', 'science-slug')

        url = '%s?q=%s' % (reverse('api-sections-list'), 'news')

        response = self.client.get(url, format='json')

        data = response.data

        self.assertEqual(data['results'][0]['name'], 'news')
        self.assertEqual(data['results'][1]['name'], 'some News')
        self.assertEqual(data['count'], 2)

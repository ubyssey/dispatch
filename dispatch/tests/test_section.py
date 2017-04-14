from django.core.urlresolvers import reverse

from rest_framework import status

from dispatch.tests.cases import DispatchAPITestCase

from dispatch.apps.content.models import Article, Person, Section

class SectionsTests(DispatchAPITestCase):

	def _create_section(self):
		"""
		Create a dummy section instance
		"""
		
		data = {
			'name': 'Test name',
			'slug': 'test-section',
		}

		url = reverse('api-sections-list')

		return self.client.post(url, data, format='json')

	def test_create_section_unauthorized(self):
		"""
		Create section should fail with unauthenticated request
		"""

		# Clear authentication credentials
		self.client.credentials()

		url = reverse('api-sections-list')

		response = self.client.post(url, None, format='json')

		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_create_empty_section(self):
		"""
		Create section should fail with empty payload
		"""
		
		url = reverse('api-sections-list')

		response = self.client.post(url, None, format='json')

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		
	def test_create_incomplete_section(self):
		"""
		Create section should fail with missing required fields
		"""
		
		url = reverse('api-sections-list')
		
		# Section data is missing slug
		data = {
			'name': 'test',
		}
		
		response = self.client.post(url, data, format='json')
		
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		
		self.assertTrue('slug' in response.data)
		
	def test_create_section(self):
		"""
		Ensure that section can be created
		"""
		
		response = self._create_section()
		
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		
		# Check data 
		self.assertEqual(response.data['name'], 'Test name')
		self.assertEqual(response.data['slug'], 'test-section')
		
	def test_create_duplicate_section(self):
		"""
		Create duplication section should fail
		"""
		
		# Create section
		response = self._create_section()
		
		# Confirm section was created
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		
		# Create section again
		response = self._create_section()
		
		# Confirm creating duplicate section returns error
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		
	def test_update_section(self):
		"""
		Ensure that section can be updated
		"""
		
		response = self._create_section()
		
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		
		# Check data 
		self.assertEqual(response.data['name'], 'Test name')
		self.assertEqual(response.data['slug'], 'test-section')
		
		# Update data 
		response.data['name'] = 'Updated name'
		response.data['slug'] = 'Updated slug'
		
		self.assertEqual(response.data['name'], 'Updated name')
		self.assertEqual(response.data['slug'], 'Updated slug')
		
	def test_delete_section_unauthorized(self):
		"""
		Delete section should fail with unauthenticated request
		"""
		
		# Create a section
		section = self._create_section()
		
		# Clear authentication credentials
		self.client.credentials()
		
		url = reverse('api-sections-detail', args=[section.data['id']])
		
		response = self.client.delete(url, format='json')
		
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
		
	def test_delete_section(self):
		"""
		Ensure that section can be deleted
		"""
		
		section = self._create_section()
		
		# Generate detail URL
		url = reverse('api-sections-detail', args=[section.data['id']])

		# Successful deletion should return 204
		response = self.client.delete(url, format='json')
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

		# Can't delete a section that has already been deleted
		response = self.client.delete(url, format='json')
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
		
	def test_get_all_sections(self):
		"""
		Ensure that it is possible to get all sections
		"""
		
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
		"""
		Ensure that it is possible to get a specific section 
		"""
		
		# Creations multiple sections 
		section_1 = Section.objects.create(slug='section-1', name='Section 1')
		section_2 = Section.objects.create(slug='section-2', name='Section 2')
		section_3 = Section.objects.create(slug='section-3', name='Section 3')
		
		url = reverse('api-sections-detail', args=[section_2.pk])

		response = self.client.get(url, format='json')
		
		# Check that section 2 is returned 
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['slug'], 'section-2')
		
		
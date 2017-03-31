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
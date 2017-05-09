from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.apps.content.models import Person
from django.core.urlresolvers import reverse  # How do I know when to use this?
from rest_framework import status


class PersonsTests(DispatchAPITestCase, DispatchMediaTestMixin):
    """
    A class to test the person api methods
    """

    def test_person_creation(self):
        """
        Test simple person creation, checks the response and database
        """
        with open(self.get_input_file('test_image.jpg')) as test_image:
            response = self._create_person(full_name='Test Person', image=test_image,
                                           slug='test-person', description='This is a description')
        # Check response correctness
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['full_name'], 'Test Person')
        self.assertEqual(response.data['slug'], 'test-person')
        self.assertEqual(response.data['description'], 'This is a description')

        # Check database correctness
        person = Person.objects.get(pk=response.data['id'])
        self.assertEqual(person.full_name, 'Test Person')
        self.assertEqual(person.slug, 'test-person')
        self.assertEqual(person.description, 'This is a description')

    def test_person_update(self):
        """
        Ensure that person update works correctly in both response and database
        """

        # Create original person
        response = self._create_person(
            full_name='Test Person', slug='test-person',
            description='This is a description')

        # Update this person
        url = reverse('api-people-detail', args=[response.data['id']])
        data = {'full_name': 'Updated Name'}

        # Check response correctness
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.data['full_name'], 'Updated Name')
        self.assertEqual(response.data['slug'], 'test-person')
        self.assertEqual(response.data['description'], 'This is a description')

        # Check database correctness
        person = Person.objects.get(pk=response.data['id'])
        self.assertEqual(person.full_name, 'Updated Name')
        self.assertEqual(person.slug, 'test-person')
        self.assertEqual(person.description, 'This is a description')

    def test_unauthorized_person_creation(self):
        """
        Create person should fail with unauthenticated request
        """
        # Clear authentication credentials
        self.client.credentials()

        response = self._create_person(
            full_name='Test Person', slug='test-person',
            description='This is a description')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_person_update(self):
        """
        Updating a person should fail with unauthenticated request
        """
        # Create original person
        response = self._create_person(
            full_name='Test Person', slug='test-person',
            description='This is a description')

        self.client.credentials()

        # Update this person
        url = reverse('api-people-detail', args=[response.data['id']])
        data = {'full_name': 'Updated Name'}

        # Check response correctness
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_empty_person(self):
        """
        Creating a person with no attributes should be pass
        """
        response = self._create_person()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def _create_person(self, full_name='', image='', slug='', description=''):
        """
        A helper method that creates a simple person object with the given attributes
        and returns the response, data and url in a dictionary
        """
        url = reverse(
            'api-people-list')  # Creates url based on views with given name

        data = {
            'full_name': full_name,
            'image': image,
            'slug': slug,
            "description": description
        }

        return self.client.post(url, data, format='multipart')

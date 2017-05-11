from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.apps.content.models import Person, User
from django.core.urlresolvers import reverse
from rest_framework import status


class PersonsTests(DispatchAPITestCase, DispatchMediaTestMixin):
    """
    A class to test the person API methods
    """

    def test_person_creation(self):
        """
        Test simple person creation, checks the response and database
        """
        with open(self.get_input_file('test_image.jpg')) as test_image:
            response = self._create_person(
                full_name='Test Person', 
                image=test_image,
                slug='test-person', 
                description='This is a description'
                )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['full_name'], 'Test Person')
        self.assertEqual(response.data['slug'], 'test-person')
        self.assertEqual(response.data['description'], 'This is a description')

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
            full_name='Test Person', 
            slug='test-person',
            description='This is a description'
            )

        # Update this person
        url = reverse('api-people-detail', args=[response.data['id']])
        data = {
            'full_name': 'Updated Name'
            }

        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.data['full_name'], 'Updated Name')
        self.assertEqual(response.data['slug'], 'test-person')
        self.assertEqual(response.data['description'], 'This is a description')

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
            full_name='Test Person', 
            slug='test-person',
            description='This is a description'
            )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_person_update(self):
        """
        Updating a person should fail with unauthenticated request
        """
        # Create original person
        response = self._create_person(
            full_name='Test Person', 
            slug='test-person',
            description='This is a description'
            )

        self.client.credentials()

        # Update this person
        url = reverse('api-people-detail', args=[response.data['id']])
        data = {
            'full_name': 'Updated Name'
            }

        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_empty_person(self):
        """
        Creating a person with no attributes should be pass
        TODO: Determine if want to change this behavior by changing command line 'stuff' for superuser
        """
        response = self._create_person()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        person = Person.objects.get(pk=response.data['id'])
        self.assertEqual(person.full_name, '')

    def test_duplicate_fullnames(self):
        """
        Having two persons with the same full name is fine
        """
        response1 = self._create_person(full_name='Test Person')
        response2 = self._create_person(full_name='Test Person')

        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)

        person1 = Person.objects.get(pk=response1.data['id'])
        person2 = Person.objects.get(pk=response2.data['id'])
        self.assertEqual(person1.full_name, 'Test Person')
        self.assertEqual(person2.full_name, 'Test Person')

    def test_duplicate_slug(self):
        """
        Having two persons with the same slug is not okay,
        because they can't have the same route
        """
        response1 = self._create_person(
            full_name='Test Person 1', 
            slug='test-person'
            )
        response2 = self._create_person(
            full_name='Test Person 2', 
            slug='test-person'
            )

        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_person(self):
        """
        Simple person deletion test and throw error if trying to delete
        an item that is already deleted/doesn't exist
        """

        response = self._create_person(
            full_name='Test Person', 
            slug='test-person'
            )
        # Generate detail URL
        url = reverse('api-people-detail', args=[response.data['id']])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Can't delete an person that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthorized_person_deletion(self):
        """
        Unauthorized deletion of a person isn't allowed
        """

        response = self._create_person(
            full_name='Test Person', 
            slug='test-person'
            )
        # Generate detail URL
        url = reverse('api-people-detail', args=[response.data['id']])

        self.client.credentials()

        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_person_user(self):
        """
        Deleting a person SHOULD NOT also delete the user associated with that person
        """
        # TODO: Add API for attaching person to user, currently bypassing API
        user = User.objects.get(pk=1)  # This is the user created in the setup

        # Create new person to attach to user
        response = self._create_person(
            full_name='Test Person', 
            slug='test-person'
            )
        user.person_id = response.data['id']
        user.save()  # Update change to database

        # Delete Person ensuring that an error is thrown since it is connect to
        # a User
        url = reverse('api-people-detail', args=[response.data['id']])

        response = self.client.delete(url, format='json')
        
        self.assertEquals(response.status_code, status.HTTP_409_CONFLICT)
    
    def test_get_image_url(self):
        """
        Test to ensure proper url is returned
        """
        # TODO: Add image support to PersonSerializer
        with open(self.get_input_file('test_image.jpg')) as test_image:
            response = self._create_person(
                full_name='Test Person', 
                image=test_image,
                slug='test-person', 
                description='This is a description'
                )

        person = Person.objects.get(pk=response.data['id'])
        self.assertEqual(person.get_image_url(), settings.MEDIA_URL + "test_image.jpg")

    def test_string_representation(self):
        """
        Test the string representation methods of the model
        """
        
        # Testing when a full name is provided
        response = self._create_person(full_name='Test Person')
        person= Person.objects.get(pk=response.data['id'])
        self.assertEqual(str(person), 'Test Person')

        # Testing without a full name
        response = self._create_person()
        person = Person.objects.get(pk=response.data['id'])
        self.assertEqual(str(person), '')

    def _create_person(self, full_name='', image='', slug='', description=''):
        """
        A helper method that creates a simple person object with the given attributes
        and returns the response
        """
        url = reverse('api-people-list')

        data = {
            'full_name': full_name,
            'image': image,
            'slug': slug,
            "description": description
        }

        return self.client.post(url, data, format='multipart')

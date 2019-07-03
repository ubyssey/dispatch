from os.path import join
from rest_framework import status

from django.urls import reverse
from django.conf import settings

from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.models import Person, User

class PersonsTests(DispatchAPITestCase, DispatchMediaTestMixin):
    """A class to test the person API methods"""

    def test_person_creation(self):
        """Test simple person creation, checks the response and database"""

        with open(self.get_input_file('test_image_a.jpg'), 'rb') as test_image:
            response = DispatchTestHelpers.create_person(
                self.client,
                full_name='Test Person',
                image=test_image,
                slug='test-person',
                description='This is a description',
                title='Coordinating Editor'
            )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['full_name'], 'Test Person')
        self.assertEqual(response.data['slug'], 'test-person')
        self.assertEqual(response.data['description'], 'This is a description')
        self.assertEqual(response.data['title'], 'Coordinating Editor')

        person = Person.objects.get(pk=response.data['id'])
        self.assertEqual(person.full_name, 'Test Person')
        self.assertEqual(person.slug, 'test-person')
        self.assertEqual(person.description, 'This is a description')
        self.assertEqual(person.title, 'Coordinating Editor')

    def test_person_update(self):
        """Ensure that person update works correctly in both response and database"""

        # Create original person
        response = DispatchTestHelpers.create_person(
            self.client,
            full_name='Test Person',
            slug='test-person',
            description='This is a description'
        )

        # Update this person
        url = reverse('api-persons-detail', args=[response.data['id']])
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
        """Create person should fail with unauthenticated request"""

        # Clear authentication credentials
        self.client.credentials()

        response = DispatchTestHelpers.create_person(
            self.client,
            full_name='Test Person',
            slug='test-person',
            description='This is a description'
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_person_update(self):
        """Updating a person should fail with unauthenticated request"""

        # Create original person
        response = DispatchTestHelpers.create_person(
            self.client,
            full_name='Test Person',
            slug='test-person',
            description='This is a description'
        )

        self.client.credentials()

        # Update this person
        url = reverse('api-persons-detail', args=[response.data['id']])
        data = {
            'full_name': 'Updated Name'
        }

        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_empty_person(self):
        """
        Creating a person with no attributes should be fail
        TODO: Determine if want to change this behavior by changing command line 'stuff' for superuser
        """
        response = DispatchTestHelpers.create_person(self.client, full_name='')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = DispatchTestHelpers.create_person(self.client, slug='')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_fullnames(self):
        """Having two persons with the same full name is not fine"""

        response1 = DispatchTestHelpers.create_person(self.client, full_name='Test Person', slug='test-person')
        response2 = DispatchTestHelpers.create_person(self.client, full_name='Test Person', slug='test-person2')

        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)

        person1 = Person.objects.get(pk=response1.data['id'])
        # person2 = Person.objects.get(pk=response2.data['id'])

        self.assertEqual(person1.full_name, 'Test Person')
        # self.assertFalse(person2.full_name, 'Test Person')

    def test_duplicate_slug(self):
        """Having two persons with the same slug is not okay,
        because they can't have the same route"""

        response1 = DispatchTestHelpers.create_person(
            self.client,
            full_name='Test Person 1',
            slug='test-person'
        )
        response2 = DispatchTestHelpers.create_person(
            self.client,
            full_name='Test Person 2',
            slug='test-person'
        )

        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_person(self):
        """Simple person deletion test and throw error if trying to delete
        an item that is already deleted/doesn't exist"""

        response = DispatchTestHelpers.create_person(
            self.client,
            full_name='Test Person',
            slug='test-person'
        )
        person_id = response.data['id']
        # Generate detail URL
        url = reverse('api-persons-detail', args=[person_id])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Person.objects.filter(id=person_id).exists())

        # Can't delete an person that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthorized_person_deletion(self):
        """Unauthorized deletion of a person isn't allowed"""

        response = DispatchTestHelpers.create_person(
            self.client,
            full_name='Test Person',
            slug='test-person'
        )
        # Generate detail URL
        url = reverse('api-persons-detail', args=[response.data['id']])

        self.client.credentials()

        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_person_user(self):
        """Deleting a person SHOULD NOT also delete the user
        associated with that person"""

        # TODO: Add API for attaching person to user, currently bypassing API
        user = User.objects.get(pk=1)  # This is the user created in the setup

        # Create new person to attach to user
        response = DispatchTestHelpers.create_person(
            self.client,
            full_name='Test Person',
            slug='test-person'
        )
        user.person_id = response.data['id']
        user.save()  # Update change to database

        # Delete Person ensuring that an error is thrown since it is connect to
        # a User
        url = reverse('api-persons-detail', args=[response.data['id']])

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_image_url(self):
        """Test to ensure proper url is returned"""

        # Test a good image
        with open(self.get_input_file('test_image_a.jpg'), 'rb') as test_image:
            response = DispatchTestHelpers.create_person(
                self.client,
                full_name='Test Person',
                image=test_image,
                slug='test-person',
                description='This is a description'
            )

        imageDirectory = "images"
        person = Person.objects.get(pk=response.data['id'])
        self.assertEqual(person.get_image_url(), join(imageDirectory, "test_image_a.jpg") )

    def test_image_validation(self):
        """Test that ensures image validator on serializer is working.
        A bad path results in a BAD_REQUEST"""

        response = DispatchTestHelpers.create_person(
            self.client,
            full_name='Test Person',
            image="fakeimagepath.jpg",
            slug='test-person-bad-image'
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_string_representation(self):
        """Test the string representation methods of the model"""

        response = DispatchTestHelpers.create_person(self.client, full_name='Test Person', slug='test-person')
        person= Person.objects.get(pk=response.data['id'])
        self.assertEqual(str(person), 'Test Person')

    def test_unauthorized_listing_get_request(self):
        """Test that an a get request for persons listing without
        admin credentials results in a UNAUTHORIZED response"""

        self.client.credentials()

        url = reverse('api-persons-list')

        response = self.client.get(url, {}, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_detail_get_request(self):
        """Test that an a get request for person detail without
        admin credentials results in a UNAUTHORIZED response"""

        self.client.credentials()

        # Use the id == 0, default person created on database creation
        url = reverse('api-persons-detail', args=[0])

        response = self.client.get(url, {}, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_persons_search(self):
        """Should be able to search through persons"""

        person_1 = DispatchTestHelpers.create_person(self.client, full_name='John Doe', slug='john-doe')
        person_2 = DispatchTestHelpers.create_person(self.client, full_name='Jane Doe', slug='jane-doe')
        person_3 = DispatchTestHelpers.create_person(self.client, full_name='Axel Jacobsen', slug='axel-jacobsen')

        url = '%s?q=%s' % (reverse('api-persons-list'), 'Doe')

        response = self.client.get(url, format='json')

        data = response.data

        self.assertEqual(data['results'][0]['full_name'], 'John Doe')
        self.assertEqual(data['results'][1]['full_name'], 'Jane Doe')
        self.assertEqual(data['count'], 2)
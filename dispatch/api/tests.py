from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate

from dispatch.apps.core.models import User, Person

class PersonTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create(email='peterjsiemens@gmail.com')
        self.person = Person.objects.create(full_name="Jane Doe")
        self.client.force_authenticate(self.user)

    def test_create_person(self):
        """
        Ensure we can create a new person.
        """
        url = reverse('people-list')
        data = {'full_name': 'John Doe'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.data['full_name'], data['full_name'])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_detail_person(self):
        """
        Ensure we can find a person.
        """
        id = self.person.id
        url = reverse('people-detail', args=(id,))
        response = self.client.get(url, format='json')
        self.assertEqual(response.data['full_name'], self.person.full_name)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_update_person(self):
        """
        Ensure we can update a person.
        """
        id = self.person.id
        url = reverse('people-detail', args=(id,))
        data = {'full_name': 'Sarah Doe'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.data['full_name'], data['full_name'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_person(self):
        """
        Ensure we can delete a person.
        """
        id = self.person.id
        url = reverse('people-detail', args=(id,))
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        try:
            Person.objects.get(pk=id)
            self.fail()
        except:
            pass

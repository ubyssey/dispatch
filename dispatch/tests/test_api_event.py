from django.core.urlresolvers import reverse

from rest_framework import status

from dispatch.apps.content.models import Event
from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers

class EventTests(DispatchAPITestCase):

    def test_create_event_unauthorized(self):
        """Creating an event shold fail with unauthenticated request"""

        self.client.credentials()

        url = reverse('api-event-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_empty_event(self):
        """Create event should fail with empty payload"""

        url = reverse('api-event-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_incomplete_event(self):
        """Create event should fail with missing required fields"""

        url = reverse('api-event-list')

        data = {
            'title': 'Test title',
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_event(self):
        """Should be able to create an event"""

        response = DispatchTestHelpers.create_event(self.client)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check the data
        self.assertEqual(response.data['title'], 'Test event')
        self.assertEqual(response.data['description'], 'Test description')
        self.assertEqual(response.data['host'], 'test host')

    def test_update_event(self):
        """Ensure that event can be updated"""

        event = DispatchTestHelpers.create_event(self.client)

        # Check data
        self.assertEqual(event.data['title'], 'Test event')
        self.assertEqual(event.data['description'], 'Test description')
        self.assertEqual(event.data['host'], 'test host')

        data = {
            'title': 'new title',
            'description': 'new description',
            'host': 'new host'
        }

        url = reverse('api-event-detail', args=[event.data['id']])

        updated_event = self.client.patch(url, data, format='json')

        # Check that data was updated
        self.assertEqual(updated_event.data['title'], u'new title')
        self.assertEqual(updated_event.data['description'], 'new description')
        self.assertEqual(updated_event.data['host'], 'new host')

    def test_delete_event_unauthorized(self):
        """Delete event should fail with unauthenticated request"""

        # Create a section
        event = DispatchTestHelpers.create_event(self.client)

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-event-detail', args=[event.data['id']])

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        try:
            Event.objects.get(pk=event.data['id'])
        except Event.DoesNotExist:
            self.fail('event should not have been deleted')

    def test_delete_event(self):
        """Ensure that event can be deleted"""

        event = DispatchTestHelpers.create_event(self.client)

        # Generate detail URL
        url = reverse('api-event-detail', args=[event.data['id']])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Can't delete a event that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_all_events(self):
        """Ensure that it is possible to get all events"""

        # Create multiple events
        Event.objects.create(title='Test event 1', description='Test description', host='test host')
        Event.objects.create(title='Test event 2', description='Test description', host='test host')
        Event.objects.create(title='Test event 3', description='Test description', host='test host')

        url = reverse('api-event-list')

        response = self.client.get(url, format='json')

        # Check that all events are returned
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 3)
        self.assertEqual(response.data['results'][0]['title'], 'Test event 1')
        self.assertEqual(response.data['results'][1]['title'], 'Test event 2')
        self.assertEqual(response.data['results'][2]['title'], 'Test event 3')

    def test_get_specific_event(self):
        """Ensure that it is possible to get a specific event"""

        # Create multiple events
        event_1 = Event.objects.create(title='Test event 1', description='Test description', host='test host')
        event_2 = Event.objects.create(title='Test event 2', description='Test description', host='test host')
        event_3 = Event.objects.create(title='Test event 3', description='Test description', host='test host')

        url = reverse('api-event-detail', args=[event_2.pk])

        response = self.client.get(url, format='json')

        # Check that event 2 is returned
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test event 2')

    def test_event_query(self):
        """Be able to search for events"""

        # Create events
        DispatchTestHelpers.create_event(self.client, title='A math lecture', description='Reimann Hypothesis', host='UBC')
        DispatchTestHelpers.create_event(self.client, title='A physics lecture', description='A String Theory Query', host='UBC')
        DispatchTestHelpers.create_event(self.client, title='Block Party!', description='Partay on the block', host='AMS')

        url_1 = '%s?q=%s' % (reverse('api-event-list'), 'lecture')
        url_2 = '%s?q=%s' % (reverse('api-event-list'), 'UBC')
        url_3 = '%s?q=%s' % (reverse('api-event-list'), 'String Theory')

        response_1 = self.client.get(url_1, format='json')
        response_2 = self.client.get(url_2, format='json')
        response_3 = self.client.get(url_3, format='json')

        data_1 = response_1.data
        data_2 = response_2.data
        data_3 = response_3.data

        self.assertEqual(data_1['results'][0]['title'], 'A math lecture')
        self.assertEqual(data_1['results'][1]['title'], 'A physics lecture')
        self.assertEqual(data_1['count'], 2)

        self.assertEqual(data_2['results'][0]['title'], 'A math lecture')
        self.assertEqual(data_2['results'][1]['title'], 'A physics lecture')
        self.assertEqual(data_2['count'], 2)

        self.assertEqual(data_3['results'][0]['title'], 'A physics lecture')
        self.assertEqual(data_3['count'], 1)

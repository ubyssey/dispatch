import datetime

from django.core.urlresolvers import reverse

from rest_framework import status

from dispatch.apps.events.facebook import FacebookEvent
from dispatch.apps.events.models import Event
from dispatch.apps.events import views
from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers

class EventTests(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_making_event(self):
        """Should be able to make and test an event"""

        event_1 = DispatchTestHelpers.create_event(self.client)
        event_2 = DispatchTestHelpers.create_event(self.client, is_submission=True)

        # Confirm that the events exist
        self.assertEqual(event_1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(event_2.status_code, status.HTTP_201_CREATED)

    def test_get_events(self):
        """API listing should, by default, should not return events with is_submission=True"""

        event_1 = DispatchTestHelpers.create_event(self.client, title='Test 1')
        event_2 = DispatchTestHelpers.create_event(self.client, title='Test 2')
        event_3 = DispatchTestHelpers.create_event(self.client, title='Test 3', is_submission=True)

        # Confirm that the events exist
        self.assertEqual(event_1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(event_2.status_code, status.HTTP_201_CREATED)
        self.assertEqual(event_3.status_code, status.HTTP_201_CREATED)

        url = reverse('api-event-list')

        response = Event.objects.all()

    def test_caching_image(self):
        """We should be able to store the facebook image locally if uploading event w/ facebook url and image"""

        facebook_url = 'https://www.facebook.com/events/001'

        facebook_image_url = 'https://static.ubyssey.ca/static/images/ubyssey-logo-small.svg'

        obj = DispatchMediaTestMixin()

        data = {
            'title': 'title',
            'description': 'description',
            'host': 'host',
            'start_time': '2017-05-25T12:00',
            'end_time': '2017-05-25T12:01',
            'location': 'location',
            'category': 'academic',
            'facebook_url': facebook_url,
            'facebook_image_url': facebook_image_url,
            'is_submission': False,
            'is_published': False,
            'submitter_email': 'fakeemail@ubyssey.com',
            'submitter_phone': '+1 604-988-1245'
        }

        url = reverse('api-event-list')

        response = self.client.post(url, data, format='multipart')
        event = Event.objects.get(id=1)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(event.image.name, '')

        event.cacheimage()

        self.assertEqual(event.image.name, 'events/ubyssey-logo-small.svg')

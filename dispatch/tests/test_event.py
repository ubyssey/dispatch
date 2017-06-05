import datetime

from django.core.urlresolvers import reverse

from rest_framework import status

from dispatch.apps.events.facebook import FacebookEvent
from dispatch.apps.events.models import Event
from dispatch.apps.events import views
from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers

class EventTests(DispatchAPITestCase):

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

        facebook_image_url = FacebookEvent('https://www.facebook.com/events/280150289084959').get_image()

        # This should cache the facebook image
        event = DispatchTestHelpers.create_event(self.client, facebook_url='https://www.facebook.com/events/280150289084959', facebook_image_url=facebook_image_url, image=None)

        self.assertEqual(event.status_code, status.HTTP_201_CREATED)

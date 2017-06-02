import datetime

from django.core.urlresolvers import reverse

from rest_framework import status

from dispatch.apps.events.models import Event
from dispatch.apps.events import views
from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers

class EventSubmissionTests(DispatchAPITestCase):

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
        print response

"""view = {'category': u'party', 'description': u"Join us for one of Canada's most spectacular runs, here in the Coast Moutains of British Columbia.  With 5 different distances on offer, education sessions, lots of prizes - there is something for everyone.  Gather your family, friends and running partners - come make a weekend of it!", 'title': u'2017 The North Face Whistler Half Marathon, 30K, 10K and 5K', 'start_time': datetime.datetime(2017, 6, 2, 12, 0, tzinfo=<django.utils.timezone.LocalTimezone object at 0x1074ea2d0>), 'facebook_image_url': u'', 'host': u'df', 'end_time': datetime.datetime(2017, 6, 4, 12, 0, tzinfo=<django.utils.timezone.LocalTimezone object at 0x1074ea2d0>), 'facebook_url': u'', 'address': u'', 'image': None, 'location': u'Whistler Half Marathon'}
"""

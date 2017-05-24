from django.core.urlresolvers import reverse

from rest_framework import status

from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.apps.content.models import Events

class EventsTests(DispatchAPITestCase):

    def test_create_event(self):
        """Should be able to create an event"""

        data = {
            'title': 'Test Title',
            'description': 'Test Description',
            'host': 'Test Host'
        }

        url = reverse('api-events-list')

        response = self.client.post(url, data, format='json')

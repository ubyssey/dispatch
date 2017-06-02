from dispatch.apps.events.facebook import FacebookEvent
from dispatch.apps.events.models import Event
from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers

class FacebookEventTests(DispatchAPITestCase):

    def test_event(self):
        """Should be able to get fb event"""

        url = 'https://www.facebook.com/events/280150289084959/?fref=ts'

        try:
            event = FacebookEvent(url)
        except FacebookAPIError:
            raise FacebookAPIError('Error in initializing event: the event may have been deleted, or there may be an error in the code')

    def test_invalid_event(self):
        """Making an event with invalid url should raise error"""

        url = 'This is an aweful url'

        try:
            event = FacebookEvent(url)
            self.fail('The initialization of the event should have failed, as the url is an invalid facebook event url')
        except:
            pass

    def test_get_json(self):
        """get_json method should return the correct json"""

        url = 'https://www.facebook.com/events/280150289084959/?fref=ts'

        event = FacebookEvent(url)

        json = event.get_json()

        self.assertEqual(json['title'], u"Halley's Comet Viewing")
        self.assertEqual(json['start_time'], '2061/07/28 21:00')
        self.assertEqual(json['end_time'], None)

    def test_get_image(self):
        """get_image method should return correct image url"""

        url = 'https://www.facebook.com/events/280150289084959/?fref=ts'

        event = FacebookEvent(url)

        image_url = event.get_image()

        self.assertEqual(image_url, 'https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/18582649_10207865367186885_5108374280709321204_n.jpg?oh=7cf8ee3a120261bbe2d6a28d38903c25&oe=59A955B6')

# TODO: Find a way to test the different cases of get_image, get_json.
        # event.get_json()
        # event.get_image()

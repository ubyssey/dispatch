from ubyssey.events.facebook import FacebookEvent, FacebookEventError
from ubyssey.events.models import Event
from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.tests.apis import FacebookTest

class FacebookEventTests(DispatchAPITestCase):

    def test_event(self):
        """Should be able to get fb event"""

        url = 'https://www.facebook.com/events/001/?fref=ts'

        try:
            event = FacebookEvent(url, api_provider=FacebookTest)
        except FacebookAPIError:
            self.fail('Could not initialize Facebook Event')

    def test_invalid_event(self):
        """Making an event with invalid url should raise error"""

        url = 'This is an aweful url'

        try:
            event = FacebookEvent(url, api_provider=FacebookTest)
            self.fail('The initialization of the event should have failed, as the url is an invalid Facebook event url')
        except:
            pass

    def test_get_json(self):
        """get_json method should return the correct json"""

        url = 'https://www.facebook.com/events/001/?fref=ts'

        event = FacebookEvent(url, api_provider=FacebookTest)

        json = event.get_json()

        self.assertEqual(json['title'], u"Halley's Comet Viewing")
        self.assertEqual(json['start_time'], '2061-07-28 21:00')
        self.assertEqual(json['end_time'], '2061-07-29 01:00')

    def test_get_json_for_invalid_event(self):
        """get_json for an event that is private/non-existant should raise an error"""

        url = 'https://www.facebook.com/events/000/'

        event = FacebookEvent(url, api_provider=FacebookTest)

        try:
            event_json = event.get_json()
            self.fail('The URL was invalid - test should have failed with FacebookEventError')
        except FacebookEventError:
            pass

    def test_get_json_no_address_or_end_time(self):
        """get_json for an event that doesnt have an address or endtime should return None for those fields"""

        url = 'https://www.facebook.com/events/002/'

        event = FacebookEvent(url, api_provider=FacebookTest)

        event_json = event.get_json()

        self.assertEqual(event_json['address'], None)
        self.assertEqual(event_json['end_time'], None)

    def test_get_image(self):
        """get_image method should return correct image url"""

        url = 'https://www.facebook.com/events/001/?fref=ts'

        event = FacebookEvent(url, api_provider=FacebookTest)

        image_url = event.get_image()

        self.assertEqual(image_url, 'https://scontent.xx.fbcdn.net/v/t1.0-0/c19.0.50.50/p50x50/18839331_1384316584980194_5794442543874726327_n.jpg?oh=4de1936423586abaf991713425a796cc&oe=59AE129D')

    def test_get_image_from_event_id(self):
        """Use the image url provided when the get_picture method fails"""

        url = 'https://www.facebook.com/events/002/?fref=ts'

        event = FacebookEvent(url, api_provider=FacebookTest)

        image_url = event.get_image()

        self.assertEqual(image_url, 'this is a preeety funky URL')

    def test_get_image_cant_find_picture(self):
        """get_image can't find any pictures"""

        url = 'https://www.facebook.com/events/003/?fref=ts'

        event = FacebookEvent(url, api_provider=FacebookTest)

        try:
            image_url = event.get_image()
            self.fail('The URL was invalid - test should have failed with FacebookEventError')
        except FacebookEventError:
            pass

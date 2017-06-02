from dispatch.apps.events.facebook import FacebookEvent
from dispatch.apps.events.models import Event
from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers

class FacebookEventTests(DispatchAPITestCase):

    def test_event(self):
        """Just using this to test out facebook_scrape.py"""

        url = 'https://www.facebook.com/events/1230150590447946/?acontext=%7B%22ref%22%3A%222%22%2C%22ref_dashboard_filter%22%3A%22upcoming%22%2C%22action_history%22%3A%22[%7B%5C%22%3A%5C%22dashboard%5C%22%2C%5C%22mechanism%5C%22%3A%5C%22mta%5C%22%3A[]%7D]%22%7D'

        event = FacebookEvent(url)

        # print event.get_json()
        # print event.get_image()

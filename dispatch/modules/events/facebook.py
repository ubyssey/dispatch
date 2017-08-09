import re
import datetime

from django.conf import settings

from dispatch.vendor.apis import Facebook, FacebookAPIError

FACEBOOK_ERROR_MESSAGE = 'Invalid url: The event could be private, or there could be an error in the url itself. Check that the event is "public" and try again'

class FacebookEventError(Exception):
    pass

class FacebookEvent(object):
    """Class to fetch Facebook event data"""

    def __init__(self, url, api_provider=Facebook):
        self.url = url
        self.event_id = self.get_event_id(url)
        self.api = api_provider()

        self.api.get_access_token({
            'client_id': settings.FACEBOOK_CLIENT_ID,
            'client_secret': settings.FACEBOOK_CLIENT_SECRET,
            'grant_type': 'client_credentials'
        })

    def get_event_id(self, url):
        """Uses regex to pull the event id from Facebook event URL"""

        # Match numbers that is the event id from the url and return them
        m = re.search('.*facebook.com/events/([0-9]+).*', url)

        if m:
            return m.group(1)
        else:
            raise FacebookEventError('URL provided is not a valid facebook event url')

    def get_json(self):
        """Returns the json for the event linked by the facebook url"""

        try:
            json = self.api.get_event(self.event_id)
        except FacebookAPIError:
            raise FacebookEventError(FACEBOOK_ERROR_MESSAGE)

        # Get what data we can from the Facebook event, and format start_time and end_time correctly
        try:
            address = json['place']['location']['street'] + ', ' + json['place']['location']['city']
        except:
            address = None

        try:
            end_time = datetime.datetime.strptime(json['end_time'][:-5], '%Y-%m-%dT%H:%M:%S')
            end_time = end_time.strftime('%Y-%m-%d %H:%M')
        except:
            end_time = None

        start_time = datetime.datetime.strptime(json['start_time'][:-5], '%Y-%m-%dT%H:%M:%S')
        start_time = start_time.strftime('%Y-%m-%d %H:%M')

        return {
            'title': json['name'],
            'description': json['description'],
            'start_time': start_time,
            'end_time': end_time,
            'location': json['place']['name'],
            'address': address,
            'facebook_url': self.url
        }

    def get_data(self):
        """Returns data from the event"""

        data = self.get_json()
        data['facebook_url'] = self.url
        data['facebook_image_url'] = self.get_image()

        return data

    def get_image(self):
        """Returns the picture url from facebook event"""

        try:
            image_data = self.api.get_photos(self.event_id)

            try:
                image_url = self.api.get_picture(image_data[0]['id'])
            except FacebookAPIError:
                image_url = self.api.get_picture(self.event_id)

        except FacebookAPIError:
            raise FacebookEventError(FACEBOOK_ERROR_MESSAGE)

        return image_url

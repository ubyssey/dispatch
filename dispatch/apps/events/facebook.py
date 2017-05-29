import urllib2, requests, re

from django.conf import settings

from dispatch.vendor.apis import Facebook, FacebookAPIError


class FacebookEvent(object):

    def __init__(self, facebook_url):

        self.facebook_url = facebook_url
        self.event_id = self.get_event_id(facebook_url)

    def get_event_id(self, facebook_url):

        # Match numbers that is the event id from the facebook_url and return them
        m = re.search('.*facebook.com/events/([0-9]+).*', facebook_url)

        if m:
            return m.group(1)
        else:
            raise Exception('URL provided is not a valid facebook event url')

    def get_json(self):
        """Returns the json for the event linked by the facebook url"""

        # Create instance of facebook
        fb = Facebook()

        fb.get_access_token({
            'client_id': settings.FACEBOOK_CLIENT_ID,
            'client_secret': settings.FACEBOOK_CLIENT_SECRET,
            'grant_type': 'client_credentials'
        })

        try:
            json = fb.get_event(self.event_id)
        except FacebookAPIError:
            raise FacebookAPIError('Invalid url: The event could be private, or there could be an error in the url itself. Check that the event is "public" and try again')

        try:
            address = json['place']['location']['street'] + ', ' + json['place']['location']['city']  
        except:
            address = None

        return {
            'title': json['name'],
            'description': json['description'],
            'start_time': json['start_time'],
            'end_time': json['end_time'],
            'location': json['place']['name'],
            'adress': address
        }

    def get_image(self):
        """Returns the picture from facebook event"""

        fb = Facebook()

        fb.get_access_token({
            'client_id': settings.FACEBOOK_CLIENT_ID,
            'client_secret': settings.FACEBOOK_CLIENT_SECRET,
            'grant_type': 'client_credentials'
        })

        try:
            image_data = fb.get_photos(self.event_id)

            try:
                image_url = fb.get_picture(image_data[0]['id'])
            except FacebookAPIError:
                image_url = fb.get_picture(self.event_id)

        except FacebookAPIError:
            raise FacebookAPIError('Invalid url: The event could be private, or there could be an error in the url itself. Check that the event is "public" and try again')

        return image_url

import urllib2, requests, re, datetime

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

        # Get what data we can from the facebook event, and format start_time and end_time correctly
        try:
            address = json['place']['location']['street'] + ', ' + json['place']['location']['city']
        except:
            address = None

        # start_time / end_time format AM/PM instead of 24 hr?
        try:
            end_time = datetime.datetime.strptime(json['end_time'][:-5], '%Y-%m-%dT%H:%M:%S')
            end_time = end_time.strftime('%Y/%m/%d %H:%M')
        except:
            end_time = None

        start_time = datetime.datetime.strptime(json['start_time'][:-5], '%Y-%m-%dT%H:%M:%S')
        start_time = start_time.strftime('%Y/%m/%d %H:%M')

        return {
            'title': json['name'],
            'description': json['description'],
            'start_time': start_time,
            'end_time': end_time,
            'location': json['place']['name'],
            'address': address,
            'facebook_url': self.facebook_url
        }

    def get_image(self):
        """Returns the picture url from facebook event"""

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

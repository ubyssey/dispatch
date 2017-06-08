from dispatch.vendor.apis import Facebook, FacebookAPIError
from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers

class FacebookTest(Facebook):

    API_ROOT = 'https://graph.facebook.com/v2.8'

    def __init__(self, access_token=None):

        self.access_token = access_token

    def get_access_token(self, params):

        self.access_token = '910205815715611|3kuW-J0iWbdRiLTOULoSjTyweuA'

    def get_event(self, event_id):

        data = {
            '001': {
              'description': "Halley's Comet's next perihelion is coming soon!",
              'name': "Halley's Comet Viewing",
              'place': {
                'name': 'Gas Works Park',
                'location': {
                  'city': 'Seattle',
                  'street': '1234 USA Way',
                  'country': 'United States',
                  'latitude': 47.646,
                  'longitude': -122.335,
                  'state': 'WA',
                  'zip': '98103'
                },
                'id': '108388672514557'
              },
              'start_time': '2061-07-28T21:00:00-0800',
              'end_time': '2061-07-29T01:00:00-0800',
              'id': '280150289084959'
            },
            '002': {
                'description': "Halley's Comet's next perihelion is coming soon!",
                'name': "Halley's Comet Viewing",
                'place': {
                  'name': 'Gas Works Park',
                  'location': {
                    'city': 'Seattle',
                    'country': 'United States',
                    'latitude': 47.646,
                    'longitude': -122.335,
                    'state': 'WA',
                    'zip': '98103'
                  },
                  'id': '108388672514557'
                },
                'start_time': '2061-07-28T21:00:00-0800',
                'id': '280150289084959'
            }
        }

        try:
            data = data[event_id]
        except KeyError:
            raise FacebookAPIError

        return data

    def get_picture(self, id):

        data = {
            '001': 'https://scontent.xx.fbcdn.net/v/t1.0-0/c19.0.50.50/p50x50/18839331_1384316584980194_5794442543874726327_n.jpg?oh=4de1936423586abaf991713425a796cc&oe=59AE129D',
            '002': 'this is a preeety funky URL'
        }

        try:
            data = data[id]
        except:
            raise FacebookAPIError

        return data

    def get_photos(self, id):

        data = {
            '001': [
                        {
                          'created_time': '2017-06-06T23:15:22+0000',
                          'id': '001'
                        }
                    ],
            '002': [
                        {
                          'created_time': '2017-06-06T23:15:22+0000',
                          'id': ''
                        }
                    ]
            }

        try:
            data = data[id]
        except:
            raise FacebookAPIError

        return data

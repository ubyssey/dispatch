import requests

class FacebookAPIError(Exception):
    pass

class Facebook(object):

    API_ROOT = 'https://graph.facebook.com/v2.8'

    def __init__(self, access_token=None):

        self.access_token = access_token

    def _get(self, uri, params={}):

        r = requests.get(uri, params=params)

        data = r.json()

        if 'error' in data:
            raise FacebookAPIError(data['error']['message'])

        return data

    def get_access_token(self, params):

        uri = '%s/oauth/access_token' % self.API_ROOT

        data = self._get(uri, params)

        self.access_token = data['access_token']

    def get_pages(self, user='me'):

        uri = '%s/%s/accounts' % (self.API_ROOT, user)

        params = {
            'access_token': self.access_token
        }

        return self._get(uri, params)

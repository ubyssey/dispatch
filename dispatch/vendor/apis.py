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

    def _post(self, uri, params={}):

        r = requests.post(uri, data=params)

        data = r.json()

        if 'error' in data:
            raise FacebookAPIError(data['error']['message'])

        return data

    def get_access_token(self, params):

        uri = '%s/oauth/access_token' % self.API_ROOT

        data = self._get(uri, params)

        self.access_token = data['access_token']

    def list_pages(self, user='me'):

        uri = '%s/%s/accounts' % (self.API_ROOT, user)

        params = {
            'access_token': self.access_token
        }

        return self._get(uri, params)

    def list_instant_articles(self, page_id):

        uri = '%s/%s/instant_articles' % (self.API_ROOT, page_id)

        params = {
            'access_token': self.access_token
        }

        return self._get(uri, params)

    def create_instant_article(self, page_id, html_source, published=False, development_mode=False):

        uri = '%s/%s/instant_articles' % (self.API_ROOT, page_id)

        params = {
            'access_token': self.access_token,
            'html_source': html_source,
            'published': published,
            'development_mode': development_mode
        }

        return self._post(uri, params)

    def get_event(self, event_id):

        url = '%s/%s' % (self.API_ROOT, event_id)

        params = {
            'access_token': self.access_token
        }

        return self._get(url, params)

    def get_picture(self, id, type='normal'):

        url = '%s/%s/picture' % (self.API_ROOT, id)

        params = {
            'access_token': self.access_token,
            'redirect': False,
            'type': type
        }

        json = self._get(url, params)

        return json['data']['url']

    def get_photos(self, id):

        url = '%s/%s/photos' % (self.API_ROOT, id)

        params = {
            'access_token': self.access_token
        }

        json = self._get(url, params)

        return json['data']

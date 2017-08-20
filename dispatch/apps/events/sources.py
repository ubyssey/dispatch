import re
import requests
from datetime import datetime
from bs4 import BeautifulSoup

from django.conf import settings

from dispatch.vendor.apis import Facebook, FacebookAPIError

ERROR_MESSAGE = 'Invalid url: The event could be private, or there could be an error in the url itself. Check that the event is "public" and try again'

class FacebookEvent(object):
    """Class to fetch Facebook event data"""

    event_type = 'facebook'

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
            raise EventError('URL provided is not a valid Facebook event url')

    def get_json(self):
        """Returns the json for the event linked by the Facebook url"""

        try:
            json = self.api.get_event(self.event_id)
        except FacebookAPIError:
            raise EventError(ERROR_MESSAGE)

        # Get what data we can from the Facebook event, and format start_time and end_time correctly
        try:
            address = json['place']['location']['street'] + ', ' + json['place']['location']['city']
        except:
            address = None

        try:
            end_time = datetime.strptime(json['end_time'][:-5], '%Y-%m-%dT%H:%M:%S')
            end_time = end_time.strftime('%Y-%m-%d %H:%M')
        except:
            end_time = None

        start_time = datetime.strptime(json['start_time'][:-5], '%Y-%m-%dT%H:%M:%S')
        start_time = start_time.strftime('%Y-%m-%d %H:%M')

        return {
            'title': json['name'],
            'description': json['description'],
            'start_time': start_time,
            'end_time': end_time,
            'location': json['place']['name'],
            'address': address,
            'event_url': self.url
        }

    def get_data(self):
        """Returns data from the event"""

        data = self.get_json()
        data['event_url'] = self.url
        data['facebook_image_url'] = self.get_image()

        return data

    def get_image(self):
        """Returns the picture url from Facebook event"""

        try:
            image_data = self.api.get_photos(self.event_id)

            try:
                image_url = self.api.get_picture(image_data[0]['id'])
            except FacebookAPIError:
                image_url = self.api.get_picture(self.event_id)

        except FacebookAPIError:
            raise EventError(ERROR_MESSAGE)

        return image_url

class UBCEvent(object):
    """Class to scrape event information from UBC Event webpages"""

    event_type = 'ubc'

    def __init__(self, url):
        self.url = url

    def get_data(self):
        """Gets the html page from self.url and returns the relevent data"""

        html = requests.get(self.url)

        try:
            html.raise_for_status()
        except:
            raise EventError('Error in importing UBC Event')

        html = html.text
        soup = BeautifulSoup(html, 'html.parser')

        value_fields = soup.find_all('td', class_='fieldval')
        title = soup.find('table', id='eventTitle').find('h2', class_='bwStatusConfirmed').find('a').text

        try:
            start_time, end_time = self.get_date_groups(value_fields[0])
        except:
            start_time, end_time = None, None

        try:
            data = {
                'title': title,
                'start_time': start_time,
                'end_time': end_time,
                'description': value_fields[2].text,
                'location': value_fields[1].text
            }
        except IndexError:
            raise EventError

        return data

    def get_date_groups(self, dates_string):
        """Returns the date groups from string. Dates have one of three forms:
           -  Saturday, August 12, 2017 9:00 AM - Sunday, August 13, 2017 1:00 PM
           -  Saturday, August 12, 2017 9:00 AM - 1:00 PM
        """

        # Split the start and end times into two elements in a list
        date_time_string = str(dates_string.text)
        time_strings = map(str.strip, date_time_string.split('-'))

        # Start time is always the same format.
        start_time = datetime.strptime(time_strings[0], '%A, %B %d, %Y %I:%M %p')

        # End time is either the same format as the start time, or just a time (and no date). Search between the two
        re_date_and_time = re.search('.*(\w{6,9}, \w{3,9} \d{1,2}, \d{4} \d{1}:\d{2} (?:AM|PM)).*', time_strings[1])
        re_time = re.search('.*(\d{1}:\d{2} (?:AM|PM)).*', time_strings[1])

        if re_date_and_time:
            found_date_and_time = re_date_and_time.group(1)
            end_time = datetime.strptime(found_date_and_time, '%A, %B %d, %Y %I:%M %p')
        elif re_time:
            found_time = re_time.group(1)
            date = start_time.date()
            time = datetime.strptime(found_time, '%I:%M %p').time()
            end_time = datetime.combine(date, time)
        else:
            raise EventError('Error Parsing start and end times from UBC Event')

        return start_time, end_time

class NoEventHandler(object):
    """Class for when no event handler can be assigned"""

    def __init__(self, url):
        raise EventError

class EventError(Exception):
    pass

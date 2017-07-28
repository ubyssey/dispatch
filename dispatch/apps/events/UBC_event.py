import requests, re
from HTMLParser import HTMLParser

class UBCEventError(Exception):
    pass

class UBCEvent(object):
    """UBC Event class"""

    class TagStripper(HTMLParser):
        """Class using the HTMLParser class to strip html tags from a string"""

        def __init__(self):
            self.reset()
            self.fed = []

        def handle_data(self, data):
            self.fed.append(data)

        def get_data(self):
            return ' '.join(self.fed)

        def strip_tags(self, html):

            self.feed(html)

            return self.get_data()

    def __init__(self, url):
        self.url = url

    def get_html(self):
        """Gets the html page from self.url and returns the relevent data"""

        html = requests.get(self.url).text

        m = re.search('.*<td class="fieldval description" colspan="[0-9]+">(.*)<\/td>.*', html)

        if m:
            return m.group(1)
        else:
            raise UBCEventError('URL Provided is not a valid UBC Event url')

    def get_data(self):
        """Returns formatted data from unformatted data"""

        unformatted_data = self.get_html()

        formatting_data = unformatted_data.replace('<br />', '\n')
        formatting_data = formatting_data.replace('&amp;', '&')
        formatting_data = formatting_data.replace('<td class="fieldname">', '\n\n')

        tag_stripper = self.TagStripper()
        description = tag_stripper.strip_tags(formatting_data)

        return {
            'description': description
        }

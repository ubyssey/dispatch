import datetime

from django.template import loader

from rest_framework import status

from dispatch.theme import register
from dispatch.theme.widgets import Zone, Widget
from dispatch.theme.event_widget import UpcomingEventsWidget, Sidebar
from dispatch.theme.fields import CharField, TextField, ArticleField, ImageField, EventField, InvalidField
from dispatch.apps.content.models import Article, Image
from dispatch.apps.events.models import Event

from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers


class UpcomingEventsTestCase(DispatchAPITestCase):

    def widgetSetUp(self):

        register.zone(Sidebar)
        register.widget(UpcomingEventsWidget)
        zone = Sidebar()
        widget = UpcomingEventsWidget()

        # Make 7 events with increasing start dates
        for index in xrange(5):

            response = DispatchTestHelpers.create_event(self.client, title=('Title ' + str(index+1)), start_time=(datetime.datetime.now() + datetime.timedelta(days=index+1)), is_published=True)

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        featured_event_id = 1

        validated_data = {
            'widget': 'upcoming-events',
            'data': {
              'title': 'Upcoming Events!',
              'featured_event': featured_event_id
            }
        }

        zone.save(validated_data)
        widget.set_data(validated_data['data'])

        return widget

    def test_upcoming_events(self):
        """Confirm that the widget can be created, and that we can pull data from it"""

        widget = self.widgetSetUp()

        widget_json = widget.to_json()

        self.assertEqual(widget_json['featured_event']['category'], 'academic')
        self.assertEqual(widget_json['featured_event']['host'], u'test host')
        self.assertEqual(widget_json['title'], 'Upcoming Events!')

    def test_widget_context(self):
        """Test the custom context method of the widget"""

        widget = self.widgetSetUp()

        widget_data = widget.context(widget.prepare_data())

        self.assertEqual(widget_data['title'], 'Upcoming Events!')
        self.assertEqual(widget_data['featured_event'].title, u'Title 1')
        self.assertEqual(widget_data['events'][0]['title'], u'Title 2')
        self.assertEqual(widget_data['events'][1]['title'], u'Title 3')
        self.assertEqual(widget_data['events'][2]['title'], u'Title 4')
        self.assertEqual(widget_data['events'][3]['title'], u'Title 5')

    def test_widget_render(self):
        """Test the rendering of the event widget"""

        def days_in_future(days):
            """returns datetime object `days` in the future"""
            return (datetime.datetime.now() + datetime.timedelta(days=days)).strftime("%B %d, %Y, %I:%M %p").replace('AM', 'a.m.').replace('PM', 'p.m.').replace(" 0", " ")

        widget = self.widgetSetUp()
        img = widget.featured_event.get_model_json(widget.data['featured_event'])['image']

        widget_html = widget.render(widget.context(widget.prepare_data()))

        html = u'<h1>Upcoming Events!</h1>\n<p>%s</p>\n<p>Title 1</p>\n<img src="%s"/>\n\n\n  <p>Title 2, %s</p>\n\n  <p>Title 3, %s</p>\n\n  <p>Title 4, %s</p>\n\n  <p>Title 5, %s</p>\n\n' % (days_in_future(1), img, days_in_future(2), days_in_future(3), days_in_future(4), days_in_future(5))

        self.assertEqual(widget_html, html)

    def test_not_enough_events(self):
        """Not enough events should just return less events"""

        register.zone(Sidebar)
        register.widget(UpcomingEventsWidget)
        zone = Sidebar()
        widget = UpcomingEventsWidget()

        # Make 7 events with increasing start dates
        for index in xrange(3):

            response = DispatchTestHelpers.create_event(self.client, title=('Title ' + str(index+1)), start_time=(datetime.datetime.now() + datetime.timedelta(days=index+1)), is_published=True)

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        featured_event_id = 1

        validated_data = {
            'widget': 'upcoming-events',
            'data': {
              'title': 'Upcoming Events!',
              'featured_event': featured_event_id
            }
        }

        zone.save(validated_data)
        widget.set_data(validated_data['data'])

        widget_data = widget.context(widget.prepare_data())

        self.assertEqual(widget_data['title'], 'Upcoming Events!')
        self.assertEqual(widget_data['featured_event'].title, u'Title 1')
        self.assertEqual(widget_data['events'][0]['title'], u'Title 2')
        self.assertEqual(widget_data['events'][1]['title'], u'Title 3')

    def test_six_events(self):
        """When a featured event is not in the first 5 events, there should be 5 events in the event list"""

        register.zone(Sidebar)
        register.widget(UpcomingEventsWidget)
        zone = Sidebar()
        widget = UpcomingEventsWidget()

        # Make 7 events with increasing start dates
        for index in xrange(6):

            response = DispatchTestHelpers.create_event(self.client, title=('Title ' + str(index+1)), start_time=(datetime.datetime.now() + datetime.timedelta(days=index+1)), is_published=True)

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        featured_event_id = 6

        validated_data = {
            'widget': 'upcoming-events',
            'data': {
              'title': 'Upcoming Events!',
              'featured_event': featured_event_id
            }
        }

        zone.save(validated_data)
        widget.set_data(validated_data['data'])

        widget_data = widget.context(widget.prepare_data())

        self.assertEqual(widget_data['title'], 'Upcoming Events!')
        self.assertEqual(widget_data['featured_event'].title, u'Title 6')
        self.assertEqual(widget_data['events'][0]['title'], u'Title 1')
        self.assertEqual(widget_data['events'][1]['title'], u'Title 2')
        self.assertEqual(widget_data['events'][2]['title'], u'Title 3')
        self.assertEqual(widget_data['events'][3]['title'], u'Title 4')
        self.assertEqual(widget_data['events'][4]['title'], u'Title 5')

    def test_no_featured_event(self):
        """When the user forgets a featured event there should be 5 listed events"""

        register.zone(Sidebar)
        register.widget(UpcomingEventsWidget)
        zone = Sidebar()
        widget = UpcomingEventsWidget()

        # Make 7 events with increasing start dates
        for index in xrange(5):

            response = DispatchTestHelpers.create_event(self.client, title=('Title ' + str(index+1)), start_time=(datetime.datetime.now() + datetime.timedelta(days=index+1)), is_published=True)

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        validated_data = {
            'widget': 'upcoming-events',
            'data': {
              'title': 'Upcoming Events!',
            }
        }

        zone.save(validated_data)
        widget.set_data(validated_data['data'])

        widget_data = widget.context(widget.prepare_data())


        self.assertEqual(widget_data['events'][0]['title'], u'Title 1')
        self.assertEqual(widget_data['events'][1]['title'], u'Title 2')
        self.assertEqual(widget_data['events'][2]['title'], u'Title 3')
        self.assertEqual(widget_data['events'][3]['title'], u'Title 4')
        self.assertEqual(widget_data['events'][4]['title'], u'Title 5')

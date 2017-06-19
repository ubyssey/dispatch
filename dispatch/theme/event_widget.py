from datetime import datetime, timedelta

from dispatch.theme.fields import CharField, TextField, ArticleField, ImageField, EventField, InvalidField
from dispatch.theme import register
from dispatch.theme.widgets import Zone, Widget
from dispatch.apps.events.models import Event

class Sidebar(Zone):
    id = 'sidebar'
    name = 'Sidebar'

class UpcomingEventsWidget(Widget):
    """Widget to display the next 5 widgets that are upcoming in the sidebar"""

    id = 'upcoming-events'
    name = 'Upcoming Events'
    template = 'widgets/test-upcoming-events.html'

    zones = [Sidebar]

    title = CharField('Upcoming Events')
    featured_event = EventField('Featured Event')

    def context(self, data):

        today = datetime.now().date()

        data['events'] = Event.objects.filter(is_published=True, start_time__gte = today).exclude(pk=self.data['featured_event']).order_by('start_time')[:5]

        return data

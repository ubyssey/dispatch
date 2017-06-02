from django.forms import ModelForm, DateTimeField
from dispatch.apps.events.models import Event

class EventForm(ModelForm):

    class Meta:

        model = Event
        fields = ['title', 'description', 'host', 'image', 'start_time', 'end_time', 'location', 'address', 'category', 'facebook_url', 'facebook_image_url', 'is_submission'] # image is throwing errors

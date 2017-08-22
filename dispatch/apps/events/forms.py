from datetime import datetime

from django.forms import ModelForm, DateTimeField, CharField, TextInput, Textarea

from dispatch.apps.events.models import Event

class EventForm(ModelForm):
    facebook_image_url = CharField(required=False)

    class Meta:
        model = Event

        fields = [
            'title',
            'description',
            'host',
            'image',
            'start_time',
            'end_time',
            'location',
            'address',
            'category',
            'event_type',
            'event_url',
            'facebook_image_url',
            'ticket_url',
            'is_submission',
            'submitter_email',
            'submitter_phone'
        ]

        widgets = {
            'title': TextInput(attrs={'placeholder': 'Title'}),
            'description': Textarea(attrs={'placeholder': 'Description'}),
            'host': TextInput(attrs={'placeholder': 'Host'}),
            'start_time': TextInput(attrs={'placeholder': 'Start Time'}),
            'end_time': TextInput(attrs={'placeholder': 'End Time'}),
            'location': TextInput(attrs={'placeholder': 'Location'}),
            'address': TextInput(attrs={'placeholder': 'Address'}),
            'ticket_url': TextInput(attrs={'placeholder': 'Link to where people can purchase tickets (optional)'}),
            'submitter_email': TextInput(attrs={'placeholder': 'Email'}),
            'submitter_phone': TextInput(attrs={'placeholder': 'Phone Number'}),
        }

    def save(self, commit=True):
        event = super(EventForm, self).save(commit=False)

        facebook_image_url = self.data.get('facebook_image_url')

        if not event.image and facebook_image_url:
            event.save_image_from_url(facebook_image_url)

        if commit:
            event.save()

        return event

    def clean(self):
        cleaned_data = super(EventForm, self).clean()

        start_time = cleaned_data.get('start_time')
        end_time = cleaned_data.get('end_time')

        if not start_time:
            self.add_error('start_time', 'You must have a start time for the event')
        elif not end_time:
            self.add_error('end_time', 'You must have an end time for the event')
        elif end_time < start_time:
            msg = 'The start time of the event must be before the end time of the event'
            self.add_error('start_time', msg)
            self.add_error('end_time', msg)

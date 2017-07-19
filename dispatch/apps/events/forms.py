from django.forms import ModelForm, DateTimeField, CharField, TextInput
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
            'facebook_url',
            'facebook_image_url',
            'is_submission',
            'submitter_email',
            'submitter_phone'
        ]

        widgets = {
            'title': TextInput(attrs={'placeholder': 'Title'}),
            'description': TextInput(attrs={'placeholder': 'Description'}),
            'host': TextInput(attrs={'placeholder': 'Host'}),
            'start_time': TextInput(attrs={'placeholder': 'Start Time'}),
            'end_time': TextInput(attrs={'placeholder': 'End Time'}),
            'location': TextInput(attrs={'placeholder': 'Location'}),
            'address': TextInput(attrs={'placeholder': 'Address'}),
            'submitter_email': TextInput(attrs={'placeholder': 'Email'}),
            'submitter_phone': TextInput(attrs={'placeholder': 'Phone Number'}),
        }

    def save(self):
        event = super(EventForm, self).save(commit=False)
        event.is_submission = True

        facebook_image_url = self.data.get('facebook_image_url')

        if not event.image and facebook_image_url:
            event.save_image_from_url(facebook_image_url)

        event.save()

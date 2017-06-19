from django.forms import ModelForm, DateTimeField, CharField
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

    def save(self):

        event = super(EventForm, self).save(commit=False)

        print event.facebook_url

        event.is_submission = True

        facebook_image_url = self.data.get('facebook_image_url')

        if not event.image and facebook_image_url:
            event.save_image_from_url(facebook_image_url)

        event.save()

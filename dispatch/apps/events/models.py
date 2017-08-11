import urllib, os

from django.core.files import File

from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField,
    ImageField, FileField, BooleanField, ForeignKey, ManyToManyField,
    SlugField, EmailField, SET_NULL)

from phonenumber_field.modelfields import PhoneNumberField

class Event(Model):

    title = CharField(max_length=255)
    description = TextField()
    host = CharField(max_length=255)

    image = ImageField(upload_to='images/events/', null=True, blank=True)

    start_time = DateTimeField(null=True)
    end_time = DateTimeField(null=True)

    location = CharField(max_length=500)
    address = CharField(max_length=500, null=True, blank=True)

    CATEGORY_CHOICES = (
        ('sports', 'Sports'),
        ('music', 'Music'),
        ('academic', 'Academic'),
        ('party', 'Party'),
        ('business', 'Business'),
        ('ceremony', 'Ceremony'),
        ('workshop', 'Workshop'),
        ('clubs', 'Clubs'),
        ('other', 'Other')
    )

    category = CharField(max_length=20, choices=CATEGORY_CHOICES)

    facebook_url = TextField(null=True, blank=True)
    ticket_url = TextField(null=True, blank=True)

    is_published = BooleanField(default=False)
    is_submission = BooleanField(default=False, blank=True)

    submitter_email = EmailField(null=True)
    submitter_phone = PhoneNumberField(null=True)

    def save_image_from_url(self, url):
        """Store image locally if a Facebook URL is passed"""

        result = urllib.urlretrieve(url)

        self.image.save(
            os.path.basename(url),
            File(open(result[0]))
        )

        self.save()

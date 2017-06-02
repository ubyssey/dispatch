import urllib, os

from django.core.files import File

from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField,
    ImageField, FileField, BooleanField, ForeignKey, ManyToManyField,
    SlugField, SET_NULL)

class Event(Model):
    title = CharField(max_length=255)
    description = TextField(max_length=1000)
    host = CharField(max_length=255)

    image = ImageField(upload_to='events/', null=True)

    start_time = DateTimeField(null=True, blank=True)
    end_time = DateTimeField(null=True, blank=True)
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
        ('other', 'Other')
    )

    category = CharField(max_length=20, choices=CATEGORY_CHOICES)

    facebook_url = TextField(max_length=500, null=True, blank=True)

    facebook_image_url = TextField(max_length=500, null=True, blank=True)

    is_submission = BooleanField(default=False, blank=True)

    def cacheimage(self):
        """Store image locally if we have a facebook url"""

        if self.facebook_image_url and not self.image:

            result = urllib.urlretrieve(self.facebook_image_url)

            self.image.save(
                    os.path.basename(self.facebook_image_url),
                    File(open(result[0]))
                    )
            self.save()

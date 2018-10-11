import uuid
import os
import StringIO
from urlparse import urlparse

from django.conf import settings

from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField,
    ImageField, FileField, BooleanField, UUIDField, ForeignKey,
    SlugField, EmailField)

from dispatch.modules.content.models import Image
from dispatch.core.storage import generate_signed_url

CATEGORY_CHOICES = (
    ('Arts', 'Arts'),
    ('Business', 'Business'),
    ('Comedy', 'Comedy'),
    ('Education', 'Education'),
    ('Games &amp; Hobbies', 'Games & Hobbies'),
    ('Government &amp; Organizations', 'Government & Organizations'),
    ('Health', 'Health'),
    ('Kids &amp; Family', 'Kids & Family'),
    ('Music', 'Music'),
    ('News &amp; Politics', 'News & Politics'),
    ('Religion &amp; Spirituality', 'Religion & Spirituality'),
    ('Science &amp; Medicine', 'Science & Medicine'),
    ('Society &amp; Culture', 'Society & Culture'),
    ('Sports &amp; Recreation', 'Sports & Recreation'),
    ('Technology', 'Technology'),
    ('TV &amp; Film', 'TV & Film'),
)

EXPLICIT_CHOICES = (
    ('No', 'No'),
    ('Yes', 'Yes'),
    ('Clean', 'Clean'),
)

class Podcast(Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    slug = SlugField(unique=True)

    title = CharField(max_length=255)
    description = TextField()

    author = CharField(max_length=255)

    owner_name = CharField(max_length=255)
    owner_email = EmailField(max_length=255)

    image = ForeignKey(Image, null=True)

    category = CharField(
        max_length=255,
        choices=CATEGORY_CHOICES,
        default=CATEGORY_CHOICES[0][0])

    explicit = CharField(
        max_length=5, 
        choices=EXPLICIT_CHOICES, 
        default=EXPLICIT_CHOICES[0][0])

class PodcastEpisode(Model):
    __original_file = None

    def __init__(self, *args, **kwargs):
        super(PodcastEpisode, self).__init__(*args, **kwargs)
        self.__original_file = str(self.file)

    id = UUIDField(primary_key=True, default=uuid.uuid4)

    podcast = ForeignKey(Podcast)

    title = CharField(max_length=255)
    description = TextField()

    author = CharField(max_length=255)

    image = ForeignKey(Image, null=True)

    duration = PositiveIntegerField(null=True)
    type = CharField(max_length=255)

    published_at = DateTimeField()

    explicit = CharField(
        max_length=5, 
        choices=EXPLICIT_CHOICES, 
        default=EXPLICIT_CHOICES[0][0])
    
    file = FileField(upload_to='podcasts/')

    def get_file_url(self):
        return "%s%s/" % (settings.MEDIA_URL, self.file)

    def save(self, **kwargs):
        is_new = self._state.adding is True

        super(PodcastEpisode, self).save(**kwargs)

        if settings.GS_USE_SIGNED_URLS:

            filepath = str(self.file)

            if filepath != self.__original_file or is_new:
                upload_to = self._meta.get_field('file').upload_to
                filepath = os.path.join(upload_to, filepath)

                self.file = filepath
                super(PodcastEpisode, self).save(update_fields=['file'])

            upload_url = generate_signed_url(filepath, self.type)

            self.file_upload_url = upload_url

import uuid
import StringIO

import mutagen

from django.conf import settings

from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField, ImageField,
    FileField, BooleanField, UUIDField, ForeignKey, SlugField, EmailField)

from dispatch.modules.content.models import Image

AUDIO_READ_LENGTH = 1024

class Podcast(Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    slug = SlugField(unique=True)

    title = CharField(max_length=255)
    description = TextField()

    author = CharField(max_length=255)

    owner_name = CharField(max_length=255)
    owner_email = EmailField(max_length=255)

    image = ForeignKey(Image, null=True)

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

    category = CharField(max_length=255, choices=CATEGORY_CHOICES)

class PodcastEpisode(Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4)

    podcast = ForeignKey(Podcast)

    title = CharField(max_length=255)
    description = TextField()

    author = CharField(max_length=255)

    image = ForeignKey(Image, null=True)

    duration = PositiveIntegerField(null=True)
    type = CharField(max_length=255)

    published_at = DateTimeField()

    EXPLICIT_CHOICES = (
        ('no', 'No'),
        ('yes', 'Yes'),
        ('clean', 'Clean'),
    )

    explicit = CharField(max_length=5, choices=EXPLICIT_CHOICES, default='no')

    file = FileField(upload_to='podcasts/')

    class InvalidAudioFile(Exception):
        pass

    def get_absolute_url(self):
        return self.file.url

    # Override
    def save(self, **kwargs):
        """Custom save method to extract information from audio file."""

        # Read 1MB of audio file
        f = self.file.read()[:AUDIO_READ_LENGTH]
        fileobj = StringIO.StringIO(f)

        audio = mutagen.File(fileobj=self.file.file)

        if audio is None:
            raise PodcastEpisode.InvalidAudioFile()

        mimes = audio.mime

        type = mimes[0]
        duration = int(audio.info.length)

        self.duration = duration
        self.type = type

        super(PodcastEpisode, self).save(**kwargs)

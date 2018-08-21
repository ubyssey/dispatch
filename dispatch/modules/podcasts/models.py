import uuid
from django.conf import settings

from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField,
    ImageField, FileField, BooleanField, UUIDField, ForeignKey, SlugField)

from dispatch.modules.content.models import Image

class Podcast(Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    slug = SlugField(unique=True)

    title = CharField(max_length=255)
    description = TextField()

    author = CharField(max_length=255)

    image = ForeignKey(Image)
    category = CharField(max_length=255)

class PodcastEpisode(Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4)

    podcast = ForeignKey(Podcast)

    title = CharField(max_length=255)
    description = TextField()

    author = CharField(max_length=255)

    image = ForeignKey(Image, null=True)

    duration = PositiveIntegerField(null=True)
    published_at = DateTimeField()

    explicit = BooleanField(default=False)

    file = FileField()

    def get_absolute_url(self):
        return settings.MEDIA_URL + str(self.file)

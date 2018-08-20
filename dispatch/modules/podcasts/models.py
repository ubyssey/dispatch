from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField,
    ImageField, FileField, BooleanField, UUIDField, ForeignKey)

class Podcast(Model):
    id = UUIDField(primary_key=True)

    title = CharField(max_length=255)
    description = TextField()

    author = CharField(max_length=255)

    image = ImageField()
    category = CharField(max_length=255)

class PodcastEpisode(Model):
    id = UUIDField(primary_key=True)

    podcast = ForeignKey(Podcast)

    title = CharField(max_length=255)
    description = TextField()

    author = CharField(max_length=255)

    image = ImageField()

    duration = PositiveIntegerField()
    published_at = DateTimeField()

    explicit = BooleanField()

    file = FileField()

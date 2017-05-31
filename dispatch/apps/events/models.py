from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField,
    ImageField, FileField, BooleanField, ForeignKey, ManyToManyField,
    SlugField, SET_NULL)

from dispatch.apps.content.models import Image

class Event(Model):
    title = CharField(max_length=255)
    description = TextField(max_length=500)
    host = CharField(max_length=255)

    image = ImageField(upload_to='images', null=True)

    start_time = DateTimeField(null=True)
    end_time = DateTimeField(null=True)
    location = CharField(max_length=500)
    address = CharField(max_length=500, null=True)

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

    facebook_url = CharField(max_length=255, null=True)

from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField,
    ImageField, BooleanField, ForeignKey, ManyToManyField, SlugField)
from django.core.validators import MaxValueValidator

from apps.core.models import Person
from apps.frontend.models import FileResource

class Tag(Model):
    name = CharField(max_length=255)

class Topic(Model):
    name = CharField(max_length=255)

class Resource(Model):
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    authors = ManyToManyField(Person)

    class Meta:
        abstract = True

class Section(Model):
    name = CharField(max_length=100, unique=True)

class Article(Resource):
    long_headline = CharField(max_length=200)
    short_headline = CharField(max_length=100)
    section = ForeignKey('Section')

    is_published = BooleanField(default=False)
    published_at = DateTimeField()
    slug = SlugField(unique=True)

    topics = ManyToManyField('Topic')
    tags = ManyToManyField('Tag')
    shares = PositiveIntegerField(default=0, blank=True, null=True)
    importance = PositiveIntegerField(validators=[MaxValueValidator(5)], default=1, blank=True, null=True)

    images = ManyToManyField('Image')
    videos = ManyToManyField('Video', blank=True, null=True)

    scripts = ManyToManyField(FileResource, related_name='scripts')
    stylesheets = ManyToManyField(FileResource, related_name='stylesheets')
    snippets = ManyToManyField(FileResource, related_name='snippets')

    content = TextField()

class Video(Resource):
    url = CharField(max_length=500)

class Image(Resource):
    img = ImageField(upload_to='images')
    caption = CharField(max_length=500)

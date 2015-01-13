from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField,
    ImageField, BooleanField, ForeignKey, ManyToManyField, SlugField)
from django.core.validators import MaxValueValidator

from dispatch.apps.core.models import Person
from dispatch.apps.frontend.models import Script, Snippet, Stylesheet

class Tag(Model):
    name = CharField(max_length=255)

    def __str__(self):
        return self.name

class Topic(Model):
    name = CharField(max_length=255)

    def __str__(self):
        return self.name

class Resource(Model):
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    authors = ManyToManyField(Person)

    class Meta:
        abstract = True

class Section(Model):
    name = CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Article(Resource):
    long_headline = CharField(max_length=200)
    short_headline = CharField(max_length=100)
    section = ForeignKey('Section')

    is_published = BooleanField(default=False)
    published_at = DateTimeField()
    slug = SlugField(unique=True)

    topics = ManyToManyField('Topic', blank=True, null=True)
    tags = ManyToManyField('Tag', blank=True, null=True)
    shares = PositiveIntegerField(default=0, blank=True, null=True)
    importance = PositiveIntegerField(validators=[MaxValueValidator(5)], default=1, blank=True, null=True)

    images = ManyToManyField('Image', blank=True, null=True)
    videos = ManyToManyField('Video', blank=True, null=True)

    scripts = ManyToManyField(Script, related_name='scripts', blank=True, null=True)
    stylesheets = ManyToManyField(Stylesheet, related_name='stylesheets', blank=True, null=True)
    snippets = ManyToManyField(Snippet, related_name='snippets', blank=True, null=True)

    content = TextField()

class Video(Resource):
    title = CharField(max_length=255)
    url = CharField(max_length=500)

class Image(Resource):
    img = ImageField(upload_to='images')
    caption = CharField(max_length=500)

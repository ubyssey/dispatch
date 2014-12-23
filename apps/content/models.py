from django.db.models import (
    Model, DateTimeField, CharField, TextField,
    ImageField, BooleanField, ForeignKey, ManyToManyField, SlugField)

from core.models import Person

class Resource(Model):
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    author = ManyToManyField(Person)

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

    content = TextField()


class Image(Resource):
    img = ImageField(upload_to='images')
    caption = CharField(max_length=500)

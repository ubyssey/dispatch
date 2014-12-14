from django.db.models import (
    Model, DateTimeField, CharField, TextField,
    ImageField, BooleanField, ForeignKey, SlugField)

#from apps.core.models import Person

class Resource(Model):
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class Section(Model):
    name = CharField(max_length=100, unique=True)

class Article(Resource):
    long_headline = CharField(max_length=200)
    short_headline = CharField(max_length=100)
    section = ForeignKey(Section)
    #author = ForeignKey(Person)
    is_published = BooleanField(default=False)
    published_at = DateTimeField()
    slug = SlugField(unique=True)
    content = TextField()


class Image(Resource):
# TODO remove once images are supported
#    img = ImageField()
    caption = CharField(max_length=500)

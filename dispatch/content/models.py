from django.db.models import (
    Model, DateTimeField, CharField, TextField,
    ImageField, BooleanField, ForeignKey)

# TODO remove once user-management is merged
#from core.models import User

class Resource(Model):
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Section(Model):
    name = CharField(max_length=100, unique=True)


class Article(Resource):
    long_headline = CharField(max_length=200)
    section = ForeignKey('Section')
#   author = ForeignKey('User')     # TODO

    is_published = BooleanField(default=False)
    published_at = DateTimeField()

    content = TextField()


class Image(Resource):
#    img = ImageField()
    caption = CharField(max_length=500)
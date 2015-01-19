from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField,
    ImageField, BooleanField, ForeignKey, ManyToManyField, SlugField)
from django.core.validators import MaxValueValidator
from django.conf import settings
from dispatch.apps.core.models import Person
from dispatch.apps.frontend.models import Script, Snippet, Stylesheet

from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image as Img
import StringIO
import os
import re

from django.db.models.signals import post_delete
from django.dispatch import receiver

class Tag(Model):
    name = CharField(max_length=255, unique=True)

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

    def add_tags(self, tags):
        self.tags.clear()
        for tag in tags.split(","):
            try:
                ins = Tag.objects.get(name=tag)
            except Tag.DoesNotExist:
                ins = Tag.objects.create(name=tag)
            self.tags.add(ins)

    def add_images(self, images):
        self.images.clear()
        for id in images.split(","):
            ins = Image.objects.get(id=id)
            self.images.add(ins)

class Video(Resource):
    title = CharField(max_length=255)
    url = CharField(max_length=500)


def save_thumbnail(image, size, name, label):
    width, height = size
    (imw, imh) = image.size
    if (imw > width) or (imh > height) :
        image.thumbnail(size, Img.ANTIALIAS)
    name = "%s-%s.jpg" % (name, label)
    output = os.path.join(settings.MEDIA_ROOT, name)
    image.save(output, format='JPEG', quality=60)

class Image(Resource):
    img = ImageField(upload_to='images')
    caption = CharField(max_length=500)

    SIZES = {
        'large': (1600,900),
        'medium': (800, 600),
        'square': (100,100)
    }

    def get_absolute_url(self):
        return self.img

    #Overriding
    def save(self, *args, **kwargs):
        super(Image, self).save(*args, **kwargs)
        if self.img:
            image = Img.open(StringIO.StringIO(self.img.read()))
            name = self.img.name.split('.')[0]

            for size in self.SIZES.keys():
                save_thumbnail(image, self.SIZES[size], name, size)

    @receiver(post_delete)
    def delete_images(sender, instance, **kwargs):
        if sender == Image:
            name = instance.img.name.split('.')[0]

            # Delete original
            path = os.path.join(settings.MEDIA_ROOT, instance.img.name)
            os.remove(path)

            # Delete other sizes
            for size in sender.SIZES.keys():
                filename = name + "-%s.jpg" % size
                path = os.path.join(settings.MEDIA_ROOT, filename)
                os.remove(path)


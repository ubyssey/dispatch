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
    authors = ManyToManyField(Person, through="Author", blank=True, null=True)

    def save_authors(self, authors):
        Author.objects.filter(resource_id=self.id).delete()
        n=0
        if type(authors) is not list:
            authors = authors.split(",")
        for author in authors:
            try:
                person = Person.objects.get(id=author)
                Author.objects.create(resource=self,person=person,order=n)
                n = n + 1
            except Person.DoesNotExist:
                pass

class Section(Model):
    name = CharField(max_length=100, unique=True)
    slug = SlugField(unique=True)

    def __str__(self):
        return self.name

class Article(Resource):
    long_headline = CharField(max_length=200)
    short_headline = CharField(max_length=100)
    section = ForeignKey('Section')

    is_active = BooleanField(default=True)
    is_published = BooleanField(default=False)
    published_at = DateTimeField()
    slug = SlugField(unique=True)

    topics = ManyToManyField('Topic', blank=True, null=True)
    tags = ManyToManyField('Tag', blank=True, null=True)
    shares = PositiveIntegerField(default=0, blank=True, null=True)
    importance = PositiveIntegerField(validators=[MaxValueValidator(5)], default=1, blank=True, null=True)

    featured_image = ForeignKey('ImageAttachment', related_name="featured_image", blank=True, null=True)

    images = ManyToManyField("Image", through='ImageAttachment', related_name='images', blank=True, null=True)
    videos = ManyToManyField('Video', blank=True, null=True)

    scripts = ManyToManyField(Script, related_name='scripts', blank=True, null=True)
    stylesheets = ManyToManyField(Stylesheet, related_name='stylesheets', blank=True, null=True)
    snippets = ManyToManyField(Snippet, related_name='snippets', blank=True, null=True)

    content = TextField()

    def tags_list(self):
        return ",".join(self.tags.values_list('name', flat=True))

    def topics_list(self):
        return ",".join(self.topics.values_list('name', flat=True))

    def images_list(self):
        return ",".join([str(i) for i in self.images.values_list('id', flat=True)])

    def get_authors(self):
        return self.authors.order_by('author__order')

    def authors_list(self):
        return ",".join([str(i) for i in self.get_authors().values_list('id', flat=True)])

    def get_date(self):
        return self.published_at.strftime("%Y-%m-%d")

    def get_time(self):
        return self.published_at.strftime("%H:%M")

    def save_related(self, data):
        tags = data["tags-list"]
        topics = data["topics-list"]
        authors = data["authors-list"]
        if tags:
            self.save_tags(tags)
        if topics:
            self.save_topics(topics)
        if authors:
            self.save_authors(authors)

    def save_tags(self, tags):
        self.tags.clear()
        for tag in tags.split(","):
            try:
                ins = Tag.objects.get(name=tag)
            except Tag.DoesNotExist:
                ins = Tag.objects.create(name=tag)
            self.tags.add(ins)

    def save_topics(self, topics):
        self.topics.clear()
        for topic in topics.split(","):
            try:
                ins = Topic.objects.get(name=topic)
            except Topic.DoesNotExist:
                ins = Topic.objects.create(name=topic)
            self.topics.add(ins)

    def save_new_attachments(self, attachments):
        def save_new_attachment(code):
            args = re.findall(r'(\".+\"|[0-9]+)+', code.group(0))
            temp_id = int(args[0])
            return "[image %s]" % str(attachments[temp_id].id)
        return re.sub(r'\[temp_image[^\[\]]*\]', save_new_attachment, self.content)

    def clear_old_attachments(self):
        to_delete = list(ImageAttachment.objects.filter(article=self).exclude(id=self.featured_image.id).values_list('id', flat=True))
        attachments = re.findall(r'\[image [^\[\]]*\]', self.content)

        for attachment in attachments:
            args = re.findall(r'(\".+\"|[0-9]+)+', attachment)
            id = int(args[0])
            try:
                to_delete.remove(id)
            except ValueError:
                pass

        ImageAttachment.objects.filter(id__in=to_delete).delete()

    def get_author_string(self):
        author_str = ""
        authors = self.authors.order_by('author__order')
        n = 1
        for author in authors:
            if n + 1 == len(authors) and len(authors) > 0:
                author_str = author_str + author.full_name + " and "
            elif n == len(authors):
                author_str = author_str + author.full_name
            else:
                author_str = author_str + author.full_name + ", "
            n = n + 1
        return author_str

class Author(Model):
    resource = ForeignKey(Resource)
    person = ForeignKey(Person)
    order = PositiveIntegerField()

class Video(Resource):
    title = CharField(max_length=255)
    url = CharField(max_length=500)


class Image(Resource):
    img = ImageField(upload_to='images')
    title = CharField(max_length=255, blank=True, null=True)

    SIZES = {
        'large': (1600, 900),
        'medium': (800, 600),
        'square': (250, 250)
    }

    THUMBNAIL_SIZE = 'square'

    def filename(self):
        return os.path.basename(self.img.name)

    def get_absolute_url(self):
        return "http://dispatch.dev:8888/media/" + str(self.img)

    def get_thumbnail_url(self):
        name = re.split('.(jpg|gif|png)', self.img.name)[0]
        return "http://dispatch.dev:8888/media/%s-%s.jpg" % (name, self.THUMBNAIL_SIZE)

    #Overriding
    def save(self, *args, **kwargs):
        super(Image, self).save(*args, **kwargs)
        if self.img:
            image = Img.open(StringIO.StringIO(self.img.read()))
            name = re.split('.(jpg|gif|png)', self.img.name)[0]
            # self.img.name.split('.(jpg|gif|png)')[0]

            for size in self.SIZES.keys():
                self.save_thumbnail(image, self.SIZES[size], name, size)

    def save_thumbnail(self, image, size, name, label):
        width, height = size
        (imw, imh) = image.size
        if (imw > width) or (imh > height) :
            image.thumbnail(size, Img.ANTIALIAS)
        name = "%s-%s.jpg" % (name, label)
        output = os.path.join(settings.MEDIA_ROOT, name)
        image.save(output, format='JPEG', quality=75)

    @receiver(post_delete)
    def delete_images(sender, instance, **kwargs):
        if sender == Image:
            name = instance.img.name.split('.')[0]

            # Delete original
            path = os.path.join(settings.MEDIA_ROOT, instance.img.name)
            try:
                os.remove(path)
            except OSError:
                pass

            # Delete other sizes
            for size in sender.SIZES.keys():
                filename = name + "-%s.jpg" % size
                path = os.path.join(settings.MEDIA_ROOT, filename)
                try:
                    os.remove(path)
                except OSError:
                    pass

class Gallery(Resource):
    #images = ManyToManyField('Image', through="ImageAttachment", blank=True, null=True)
    pass

class ImageAttachment(Model):
    NORMAL = 'normal'
    FILE = 'file'
    COURTESY = 'courtesy'
    TYPE_CHOICES = (
        (NORMAL, 'Normal'),
        (FILE, 'File photo'),
        (COURTESY, 'Courtesy photo'),
    )

    article = ForeignKey(Article, blank=True, null=True)
    caption = CharField(max_length=255, blank=True, null=True)
    image = ForeignKey(Image, related_name='image')
    type = CharField(max_length=255, choices=TYPE_CHOICES, default=NORMAL, null=True)
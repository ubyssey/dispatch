import datetime
import StringIO
import os
import re

from jsonfield import JSONField
from PIL import Image as Img

from django.db import IntegrityError
from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField,
    ImageField, FileField, BooleanField, ForeignKey, ManyToManyField,
    SlugField, SET_NULL)
from django.conf import settings
from django.core.validators import MaxValueValidator
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models.signals import post_delete
from django.dispatch import receiver

from dispatch.modules.content.managers import PublishableManager
from dispatch.modules.content.render import content_to_html, content_to_json
from dispatch.modules.auth.models import Person, User

class Tag(Model):
    name = CharField(max_length=255, unique=True)

class Topic(Model):
    name = CharField(max_length=255)
    last_used = DateTimeField(null=True)

    def update_timestamp(self):
        self.last_used = datetime.datetime.now()
        self.save()

class Section(Model):
    name = CharField(max_length=100, unique=True)
    slug = SlugField(unique=True)

class Publishable(Model):
    """
    Base model for Article and Page models.
    """

    revision_id = PositiveIntegerField(default=0)
    head = BooleanField(default=False)

    is_published = BooleanField(default=False)
    is_active = BooleanField(default=True)

    slug = SlugField(max_length=255)

    shares = PositiveIntegerField(default=0, blank=True, null=True)
    views = PositiveIntegerField(default=0)

    featured_image = ForeignKey('ImageAttachment', on_delete=SET_NULL, related_name='%(class)s_featured_image', blank=True, null=True)

    template = CharField(max_length=255, default='default')
    template_data = JSONField(default={})

    seo_keyword = CharField(max_length=100, null=True)
    seo_description = TextField(null=True)

    integrations = JSONField(default={})

    _content = JSONField(db_column='content', default=[])
    snippet = TextField(null=True)

    created_at = DateTimeField()
    updated_at = DateTimeField(auto_now=True)
    published_at = DateTimeField(null=True)

    objects = PublishableManager()

    def get_content(self):
        return content_to_json(self._content)

    def set_content(self, content):
        self._content = content

    content = property(get_content, set_content)

    @property
    def template_fields(self):
        if not hasattr(self, '_template_fields'):
            template = self.get_template()
            if template:
                template.set_data(self.template_data)
                self._template_fields = template.prepare_data()
        return self._template_fields

    def add_view(self):
        self.views += 1
        self.save(revision=False)

    def get_template_path(self):
        if self.template != 'default':
            return 'article/%s.html' % self.template
        else:
            return 'article/default.html'

    def get_template(self):
        if not hasattr(self, '_template'):
            from dispatch.theme import ThemeManager

            try:
                self._template = ThemeManager.Templates.get(self.template)
            except:
                self._template = None

        return self._template

    @property
    def html(self):
        """Return HTML representation of content"""
        return content_to_html(self.content)

    def is_parent(self):
        return self.parent is None

    def publish(self):
        # Unpublish last published version
        type(self).objects.filter(parent=self.parent, is_published=True).update(is_published=False, published_at=None)
        self.is_published = True
        if self.published_at is None:
            self.published_at = datetime.datetime.now()
        self.save(revision=False)
        return self

    def unpublish(self):
        type(self).objects.filter(parent=self.parent, is_published=True).update(is_published=False, published_at=None)
        self.is_published = False
        return self

    # Overriding
    def save(self, revision=True, *args, **kwargs):
        """
        Handles the saving/updating of a Publishable instance.

        Arguments:
        revision - if True, a new version of this Publishable will be created.
        """

        if revision:
            # If this is a revision, set it to be the head of the list and increment the revision id
            self.head = True
            self.revision_id += 1

            previous_revision = self.get_previous_revision()

            if not self.is_parent():
                # If this is a revision, delete the old head of the list.
                type(self).objects.filter(parent=self.parent, head=True).update(head=False)

                # Clear the instance id to force Django to save a new instance.
                # Both fields (pk, id) required for this to work -- something to do with model inheritance
                self.pk = None
                self.id = None

                # New version is unpublished by default
                self.is_published = False

        # Raise integrity error if instance with given slug already exists.
        if type(self).objects.filter(slug=self.slug).exclude(parent=self.parent).exists():
           raise IntegrityError("%s with slug '%s' already exists." % (type(self).__name__, self.slug))

        # Set created_at to current time, but only for first version
        if not self.created_at:
            self.created_at = timezone.now()

        super(Publishable, self).save(*args, **kwargs)

        # Update the parent foreign key
        if not self.parent:
            self.parent = self
            super(Publishable, self).save(update_fields=['parent'])

        return self

    def save_featured_image(self, data):
        """
        Handles saving the featured image.

        If data is None, the featured image will be removed.

        `data` should be dictionary with the following format:
          {
            'image_id': int,
            'caption': str,
            'credit': str
          }
        """

        attachment = self.featured_image

        if data is None:
            if attachment:
                attachment.delete()
            return

        if not attachment:
            attachment = ImageAttachment()

        attachment.image_id = data.get('image_id', attachment.image_id)
        attachment.caption = data.get('caption', None)
        attachment.credit = data.get('credit', None)

        instance_type = str(type(self)).lower()

        setattr(attachment, instance_type, self)

        attachment.save()

        self.featured_image = attachment

    def get_published_version(self):
        try:
            published = type(self).objects.get(parent=self.parent, is_published=True)
            return published.revision_id
        except:
            return None

    def get_latest_version(self):
        try:
            head = type(self).objects.get(parent=self.parent, head=True)
            return head.revision_id
        except:
            return None

    def get_previous_revision(self):
        if self.parent == self:
            return self
        try:
            revision = type(self).objects.filter(parent=self.parent).order_by('-pk')[1]
            return revision
        except:
            return self

    class Meta:
        abstract = True

class Article(Publishable):

    parent = ForeignKey('Article', related_name='article_parent', blank=True, null=True)

    headline = CharField(max_length=255)
    section = ForeignKey('Section')
    authors = ManyToManyField(Person, through="Author")
    topic = ForeignKey('Topic', null=True)
    tags = ManyToManyField('Tag')

    IMPORTANCE_CHOICES = [(i,i) for i in range(1,6)]

    importance = PositiveIntegerField(validators=[MaxValueValidator(5)], choices=IMPORTANCE_CHOICES, default=3)

    READING_CHOICES = (
        ('anytime', 'Anytime'),
        ('morning', 'Morning'),
        ('midday', 'Midday'),
        ('evening', 'Evening'),
    )

    reading_time = CharField(max_length=100, choices=READING_CHOICES, default='anytime')

    @property
    def title(self):
        return self.headline

    def get_authors(self):
        return self.authors.order_by('author__order')

    def get_related(self):
        return Article.objects.exclude(pk=self.id).filter(section=self.section,is_published=True).order_by('-published_at')[:5]

    def get_reading_list(self, ref=None, dur=None):
        articles = self.get_related()
        name = self.section.name

        return {
            'ids': ",".join([str(a.parent_id) for a in articles]),
            'name': name
        }

    def save_tags(self, tag_ids):
        self.tags.clear()
        for tag_id in tag_ids:
            try:
                tag = Tag.objects.get(id=int(tag_id))
                self.tags.add(tag)
            except Tag.DoesNotExist:
                pass

    def save_topic(self, topic_id):
        if topic_id is None:
            self.topic = None
        else:
            try:
                topic = Topic.objects.get(id=int(topic_id))
                topic.update_timestamp()
                self.topic = topic
            except Topic.DoesNotExist:
                pass

    def save_authors(self, authors):
        # Clear current authors
        Author.objects.filter(article=self).delete()

        # Create a new author for each person in list
        # Use `n` to save authors in correct order
        for n, person_id in enumerate(authors):
            Author.objects.create(article=self, person_id=person_id, order=n)

    def get_author_string(self, links=False):
        """
        Returns list of authors as a comma-separated string (with 'and' before last author).
        """
        def format_author(author):
            if links and author.slug:
                return '<a href="/author/%s/">%s</a>' % (author.slug, author.full_name)
            return author.full_name

        authors = map(format_author, self.authors.order_by('author__order'))

        if not authors:
            return ""
        elif len(authors) == 1:
            # If this is the only author, just return author name
            return authors[0]

        return ", ".join(authors[:-1]) + " and " + authors[-1]

    def get_author_url(self):
        """
        Returns list of authors (including hyperlinks) as a comma-separated string (with 'and' before last author).
        """
        return self.get_author_string(True)


    def get_absolute_url(self):
        """
        Returns article URL.
        """
        return "%s%s/%s/" % (settings.BASE_URL, self.section.slug, self.slug)

class Page(Publishable):
    parent = ForeignKey('Page', related_name='page_parent', blank=True, null=True)
    parent_page = ForeignKey('Page', related_name='parent_page_fk', null=True)
    title = CharField(max_length=255)

    def get_author_string(self):
        return None

class Author(Model):
    article = ForeignKey(Article, null=True)
    image = ForeignKey('Image', null=True)
    person = ForeignKey(Person)
    order = PositiveIntegerField()

class Video(Model):
    title = CharField(max_length=255)
    url = CharField(max_length=500)

class Image(Model):
    img = ImageField(upload_to='images/%Y/%m')
    title = CharField(max_length=255, blank=True, null=True)
    width = PositiveIntegerField(blank=True, null=True)
    height = PositiveIntegerField(blank=True, null=True)

    authors = ManyToManyField(Person, through='Author', related_name='authors')

    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    SIZES = {
        'large': (1600, 900),
        'medium': (800, 600),
        'square': (250, 250)
    }

    JPG_FORMATS = {
        'jpg',
        'JPG',
        'JPEG',
        'jpeg'
    }

    IMAGE_FORMATS = '.(jpg|JPEG|jpeg|JPG|gif|png)'
    VALID_IMAGE_FORMATS = '.(jpg|gif|png)'

    THUMBNAIL_SIZE = 'square'

    def is_gif(self):
        """Returns true if image is a gif"""
        return self.get_file_extension() in ('gif', 'GIF')

    def filename(self):
        """Returns the image filename."""
        return os.path.basename(self.img.name)

    def get_file_name(self):
        """Returns the image filename."""
        return self.img.name

    def get_name(self):
        """Returns the filename without extension."""
        file_name = re.split(self.VALID_IMAGE_FORMATS, self.get_file_name())
        return file_name[0]

    def get_file_extension(self):
        """Returns the file extension."""
        file_name = re.split(self.VALID_IMAGE_FORMATS, self.get_file_name())
        try:
            return file_name[1]
        except IndexError:
            return ''

    def get_absolute_url(self):
        """Returns the full size image URL."""
        return settings.MEDIA_URL + str(self.img)

    def get_medium_url(self):
        """Returns the medium size image URL."""
        if self.is_gif():
            return self.get_absolute_url()
        return '%s%s-%s.jpg' % (settings.MEDIA_URL, self.get_name(), 'medium')

    def get_thumbnail_url(self):
        """Returns the thumbnail URL."""
        return '%s%s-%s.jpg' % (settings.MEDIA_URL, self.get_name(), self.THUMBNAIL_SIZE)

    # Overriding
    def save(self, **kwargs):
        """Custom save method to process thumbnails and save image dimensions."""

        is_new = self.pk is None

        name = re.split(self.IMAGE_FORMATS, self.img.name)[0]
        file_type = re.split(self.IMAGE_FORMATS, self.img.name)[1]

        # Standardize jpg extension
        if file_type in self.JPG_FORMATS:
            self.img.name = '%s.jpg' % name

        # Call super method
        super(Image, self).save(**kwargs)

        if is_new and self.img:
            image = Img.open(StringIO.StringIO(self.img.read()))
            self.width, self.height = image.size
            super(Image, self).save()
            name = re.split(self.IMAGE_FORMATS, self.img.name)[0]
            file_type = re.split(self.IMAGE_FORMATS, self.img.name)[1]

            for size in self.SIZES.keys():
                self.save_thumbnail(image, self.SIZES[size], name, size, file_type)


    def save_thumbnail(self, image, size, name, label, fileType):
        width, height = size
        (imw, imh) = image.size

        # If image is larger than thumbnail size, resize image
        if (imw > width) or (imh > height):
            image.thumbnail(size, Img.ANTIALIAS)

        # Attach new thumbnail label to image filename
        name = "%s-%s.jpg" % (name, label)

        # Image.save format takes JPEG not jpg
        if fileType in self.JPG_FORMATS:
            fileType = 'JPEG'

        # Write new thumbnail to StringIO object
        image_io = StringIO.StringIO()
        image.save(image_io, format=fileType, quality=75)

        # Convert StringIO object to Django File object
        thumb_file = InMemoryUploadedFile(image_io, None, name, 'image/jpeg', image_io.len, None)

        # Save the new file to the default storage system
        default_storage.save(name, thumb_file)

    def save_authors(self, authors):
        Author.objects.filter(image=self).delete()

        for n, person_id in enumerate(authors):
            Author.objects.create(image=self, person_id=person_id, order=n)

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

class ImageAttachment(Model):

    article = ForeignKey(Article, blank=True, null=True, related_name='article')
    page = ForeignKey(Page, blank=True, null=True, related_name='page')
    gallery = ForeignKey('ImageGallery', blank=True, null=True)

    caption = TextField(blank=True, null=True)
    credit = TextField(blank=True, null=True)
    image = ForeignKey(Image, related_name='image', on_delete=SET_NULL, null=True)

    order = PositiveIntegerField(null=True)

class ImageGallery(Model):
    title = CharField(max_length=255)
    images = ManyToManyField(ImageAttachment, related_name="images")

    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    def save_attachments(self, attachments):
        self.images.clear()
        ImageAttachment.objects.filter(gallery=self).delete()
        for attachment in attachments:
            attachment_obj = ImageAttachment(gallery=self, caption=attachment['caption'], credit=attachment['credit'], image_id=attachment['image_id'])
            attachment_obj.save()
            self.images.add(attachment_obj)

class File(Model):

    name = CharField(max_length=255)
    file = FileField(upload_to='files/%Y/%m')

    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    def get_absolute_url(self):
        """
        Returns the absolute file URL.
        """
        return settings.MEDIA_URL + str(self.file)

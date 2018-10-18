import StringIO
import os
import re
import uuid
import datetime

from jsonfield import JSONField
from PIL import Image as Img

from django.db import IntegrityError
from django.db import transaction

from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField,
    ImageField, FileField, BooleanField, UUIDField, ForeignKey,
    ManyToManyField, SlugField, SET_NULL, CASCADE, F)
from django.conf import settings
from django.core.validators import MaxValueValidator
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models.signals import post_delete
from django.dispatch import receiver

from dispatch.modules.content.managers import PublishableManager
from dispatch.modules.content.render import content_to_html
from dispatch.modules.content.mixins import AuthorMixin
from dispatch.modules.auth.models import Person

class Tag(Model):
    name = CharField(max_length=255, unique=True)

class Topic(Model):
    name = CharField(max_length=255)
    slug = SlugField(unique=True, max_length=255)
    last_used = DateTimeField(null=True)

    def update_timestamp(self):
        self.last_used = timezone.now()
        self.save()

    def _generate_slug(self):
        if self.name:
            return self.name.lower().replace(' ', '-')

        return None

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._generate_slug()
        
        super(Topic, self).save(*args, **kwargs)

class Section(Model):
    name = CharField(max_length=100, unique=True)
    slug = SlugField(unique=True)

class Author(Model):
    person = ForeignKey(Person)
    order = PositiveIntegerField()
    type = CharField(blank=True, default='author', max_length=100)

    class Meta:
        ordering = ['order']

class Publishable(Model):
    """
    Base model for Article and Page models.
    """

    preview_id = UUIDField(default=uuid.uuid4)
    revision_id = PositiveIntegerField(default=0, db_index=True)
    head = BooleanField(default=False, db_index=True)

    is_published = BooleanField(default=False, db_index=True)
    is_active = BooleanField(default=True)

    published_version = PositiveIntegerField(null=True)
    latest_version = PositiveIntegerField(null=True)

    slug = SlugField(max_length=255, db_index=True)

    shares = PositiveIntegerField(default=0, blank=True, null=True)
    views = PositiveIntegerField(default=0)

    featured_image = ForeignKey('ImageAttachment', on_delete=SET_NULL, related_name='%(class)s_featured_image', blank=True, null=True)
    featured_video = ForeignKey('VideoAttachment', on_delete=SET_NULL, related_name='%(class)s_featured_video', blank=True, null=True)

    template = CharField(max_length=255, default='default')
    template_data = JSONField(default={})

    seo_keyword = CharField(max_length=100, null=True)
    seo_description = TextField(null=True)

    integrations = JSONField(default={})

    content = JSONField(default=[])
    snippet = TextField(null=True)

    created_at = DateTimeField()
    updated_at = DateTimeField()
    published_at = DateTimeField(null=True)

    objects = PublishableManager()

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
        return content_to_html(self.content, self.id)

    def is_parent(self):
        return self.parent is None

    def publish(self):
        # Unpublish last published version
        type(self).objects.filter(parent=self.parent, is_published=True).update(is_published=False, published_at=None)
        self.is_published = True
        if self.published_at is None:
            self.published_at = timezone.now()
        self.save(revision=False)

        # Set published version for all articles
        type(self).objects.filter(parent=self.parent).update(published_version=self.revision_id)
        self.published_version = self.revision_id

        return self

    def unpublish(self):
        type(self).objects.filter(parent=self.parent, is_published=True).update(is_published=False, published_at=None)
        self.is_published = False

        # Unset published version for all articles
        type(self).objects.filter(parent=self.parent).update(published_version=None)
        self.published_version = None

        return self

    # Overriding
    @transaction.atomic
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
            self.updated_at = timezone.now()

        if revision:
            self.updated_at = timezone.now()

        # Check that there is only one 'head'
        if self.is_conflicting_head():
            raise IntegrityError("%s with head=True already exists." % (type(self).__name__,))

        # Check that there is only one version with this revision_id
        if self.is_conflicting_revision_id():
            raise IntegrityError("%s with revision_id=%s already exists." % (self.revision_id, type(self).__name__))

        super(Publishable, self).save(*args, **kwargs)

        # Update the parent foreign key
        if not self.parent:
            self.parent = self
            super(Publishable, self).save(update_fields=['parent'])

        if revision:
            # Set latest version for all articles
            type(self).objects.filter(parent=self.parent).update(latest_version=self.revision_id)
            self.latest_version = self.revision_id

        return self

    # Overriding delete the parent article to cascade delete all versions
    def delete(self, *args, **kwargs):
        if self.parent == self:
            return super(Publishable, self).delete(*args, **kwargs)
        return self.parent.delete()

    def is_conflicting_head(self):
        return self.head is True and type(self).objects.filter(parent=self.parent, head=True).exclude(id=self.id).exists()

    def is_conflicting_revision_id(self):
        return type(self).objects.filter(parent=self.parent, id=self.id).count() > 1

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

            self.featured_image = None
            return

        if data['image_id'] is None:
            if attachment:
                attachment.delete()

            self.featured_image = None
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

    def save_featured_video(self, data):
        attachment = self.featured_video

        if data is None:
            if attachment:
                attachment.delete()

            self.featured_video = None
            return

        if data['video_id'] is None:
            if attachment:
                attachment.delete()

            self.featured_video = None
            return

        if not attachment:
            attachment = VideoAttachment()

        attachment.video_id = data.get('video_id', attachment.video_id)
        attachment.caption = data.get('caption', None)
        attachment.credit = data.get('credit', None)

        instance_type = str(type(self)).lower()

        setattr(attachment, instance_type, self)

        attachment.save()

        self.featured_video = attachment

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

class Article(Publishable, AuthorMixin):

    parent = ForeignKey('Article', related_name='article_parent', blank=True, null=True)

    headline = CharField(max_length=255)
    section = ForeignKey('Section')
    subsection = ForeignKey('Subsection', related_name='article_subsection', blank=True, null=True)
    authors = ManyToManyField('Author', related_name='article_authors')
    topic = ForeignKey('Topic', null=True)
    tags = ManyToManyField('Tag')

    is_breaking = BooleanField(default=False)
    breaking_timeout = DateTimeField(blank=True, null=True)

    IMPORTANCE_CHOICES = [(i,i) for i in range(1,6)]

    importance = PositiveIntegerField(validators=[MaxValueValidator(5)], choices=IMPORTANCE_CHOICES, default=3)

    READING_CHOICES = (
        ('anytime', 'Anytime'),
        ('morning', 'Morning'),
        ('midday', 'Midday'),
        ('evening', 'Evening'),
    )

    reading_time = CharField(max_length=100, choices=READING_CHOICES, default='anytime')

    AuthorModel = Author

    @property
    def title(self):
        return self.headline

    def get_related(self):
        return Article.objects.exclude(pk=self.id).filter(section=self.section,is_published=True).order_by('-published_at')[:5]

    def get_reading_list(self, ref=None, dur=None):
        articles = self.get_related()
        name = self.section.name

        return {
            'ids': ",".join([str(a.parent_id) for a in articles]),
            'name': name
        }

    def is_currently_breaking(self):
        if self.is_published and self.is_breaking:
            if self.breaking_timeout:
                return timezone.now() < self.breaking_timeout
        return False

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

    def get_absolute_url(self):
        """ Returns article URL. """
        return "%s%s/%s/" % (settings.BASE_URL, self.section.slug, self.slug)

    def get_subsection(self):
        """ Returns the subsection set in the parent article """
        return self.parent.subsection

    def save_subsection(self, subsection_id):
        """ Save the subsection to the parent article """
        Article.objects.filter(parent_id=self.parent.id).update(subsection_id=subsection_id)

class Subsection(Model, AuthorMixin):
    name = CharField(max_length=100, unique=True)
    slug = SlugField(unique=True)
    description = TextField(null=True, blank=True)
    authors = ManyToManyField('Author', related_name='subsection_authors')
    section = ForeignKey('Section')
    is_active = BooleanField(default=False)

    AuthorModel = Author

    def save_articles(self, article_ids):
        Article.objects.filter(subsection=self).update(subsection=None)
        Article.objects.filter(parent_id__in=article_ids).update(subsection=self)

    def get_articles(self):
        return Article.objects.filter(subsection=self, id=F('parent_id'))

    def get_published_articles(self):
        return Article.objects.filter(subsection=self, is_published=True).order_by('-published_at')

    def get_absolute_url(self):
        """ Returns the subsection URL. """
        return "%s%s/" % (settings.BASE_URL, self.slug)

class Page(Publishable):
    parent = ForeignKey('Page', related_name='page_parent', blank=True, null=True)
    parent_page = ForeignKey('Page', related_name='parent_page_fk', null=True)
    title = CharField(max_length=255)

    def get_author_string(self):
        return None

    def get_absolute_url(self):
        """ Returns page URL. """
        return "%s%s/" % (settings.BASE_URL, self.slug)

class Video(Model):
    title = CharField(max_length=255)
    url = CharField(max_length=500)

class Image(Model, AuthorMixin):
    img = ImageField(upload_to='images/%Y/%m')
    title = CharField(max_length=255, blank=True, null=True)
    width = PositiveIntegerField(blank=True, null=True)
    height = PositiveIntegerField(blank=True, null=True)

    authors = ManyToManyField(Author, related_name='image_authors')
    tags = ManyToManyField('Tag')

    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    SIZES = {
        'large': (1600, 900),
        'medium': (800, 600),
        'square': (250, 250)
    }

    JPG_FORMATS = ('jpg', 'JPG', 'JPEG', 'jpeg',)
    GIF_FORMATS = ('gif', 'GIF',)

    IMAGE_FORMATS = '.(jpg|JPEG|jpeg|JPG|gif|png|PNG|tiff|tif|dng)'

    THUMBNAIL_SIZE = 'square'

    AuthorModel = Author

    def is_gif(self):
        """Returns true if image is a gif."""
        return self.get_extension() in self.GIF_FORMATS

    def get_filename(self):
        """Returns the image filename."""
        return os.path.basename(self.img.name)

    def get_name(self):
        """Returns the filename without its extension."""
        return os.path.splitext(self.img.name)[0]

    def get_extension(self):
        """Returns the file extension."""
        ext = os.path.splitext(self.img.name)[1]
        if ext:
            # Remove period from extension
            return ext[1:]
        return ext

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

        if is_new:
            # Make filenames lowercase
            self.img.name = self.img.name.lower()

        # Call super method
        super(Image, self).save(**kwargs)

        if is_new and self.img:
            data = self.img.read()

            if not data:
                return

            image = Img.open(StringIO.StringIO(data))

            self.width, self.height = image.size

            super(Image, self).save()

            name = self.get_name()
            ext = self.get_extension()

            for size in self.SIZES.keys():
                self.save_thumbnail(image, self.SIZES[size], name, size, ext)

    def save_thumbnail(self, image, size, name, label, file_type):
        """Processes and saves a resized thumbnail version of the image."""
        width, height = size
        (imw, imh) = image.size

        # If image is larger than thumbnail size, resize image
        if (imw > width) or (imh > height):
            image.thumbnail(size, Img.ANTIALIAS)

        # Attach new thumbnail label to image filename
        name = "%s-%s.jpg" % (name, label)

        # Image.save format takes JPEG not jpg
        if file_type in self.JPG_FORMATS:
            file_type = 'JPEG'

        # Write new thumbnail to StringIO object
        image_io = StringIO.StringIO()
        image.save(image_io, format=file_type, quality=75)

        # Convert StringIO object to Django File object
        thumb_file = InMemoryUploadedFile(image_io, None, name, 'image/jpeg', image_io.len, None)

        # Save the new file to the default storage system
        default_storage.save(name, thumb_file)

    def save_tags(self, tag_ids):
        self.tags.clear()
        for tag_id in tag_ids:
            try:
                tag = Tag.objects.get(id=int(tag_id))
                self.tags.add(tag)
            except Tag.DoesNotExist:
                pass

class VideoAttachment(Model):
    article = ForeignKey(Article, blank=True, null=True, related_name='video_article')
    page = ForeignKey(Page, blank=True, null=True, related_name='video_page')

    caption = TextField(blank=True, null=True)
    credit = TextField(blank=True, null=True)
    video = ForeignKey(Video, related_name='video', on_delete=SET_NULL, null=True)

    order = PositiveIntegerField(null=True)

class ImageAttachment(Model):
    article = ForeignKey(Article, blank=True, null=True, related_name='image_article')
    page = ForeignKey(Page, blank=True, null=True, related_name='image_page')
    gallery = ForeignKey('ImageGallery', blank=True, null=True)

    caption = TextField(blank=True, null=True)
    credit = TextField(blank=True, null=True)
    style = CharField(max_length=255, blank=True, null=True)
    width = CharField(max_length=255, blank=True, null=True)
    image = ForeignKey(Image, related_name='image', on_delete=SET_NULL, null=True)

    order = PositiveIntegerField(null=True)

class ImageGallery(Model):
    title = CharField(max_length=255)
    images = ManyToManyField(ImageAttachment, related_name='images')

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

class Issue(Model):
    title = CharField(max_length=255)
    file = FileField(upload_to='issues/%Y/%m')
    img = ImageField(upload_to='images/%Y/%m')
    volume = PositiveIntegerField(null=True)
    issue = PositiveIntegerField(null=True)
    date = DateTimeField()

class Poll(Model):
    name = CharField(max_length=255)
    question = CharField(max_length=255)
    is_open = BooleanField(default=True)
    show_results = BooleanField(default=True)

    @transaction.atomic
    def save_answers(self, answers, is_new):
        if not is_new:
            self.delete_old_answers(answers)
        for answer in answers:
            try:
                answer_id = answer.get('id')
                answer_obj = PollAnswer.objects.get(poll=self, id=answer_id)
                answer_obj.name = answer['name']
            except PollAnswer.DoesNotExist:
                answer_obj = PollAnswer(poll=self, name=answer['name'])
            answer_obj.save()

    def delete_old_answers(self, answers):
        PollAnswer.objects.filter(poll=self) \
            .exclude(id__in=[answer.get('id', 0) for answer in answers]) \
            .delete()

    def get_total_votes(self):
        return PollVote.objects.filter(answer__poll=self).count()

class PollAnswer(Model):
    poll = ForeignKey(Poll, related_name='answers', on_delete=CASCADE)
    name = CharField(max_length=255)

    def get_vote_count(self):
        """Return the number of votes for this answer"""
        return PollVote.objects.filter(answer=self).count()

class PollVote(Model):
    id = UUIDField(default=uuid.uuid4, primary_key=True)
    answer = ForeignKey(PollAnswer, related_name='votes', on_delete=CASCADE)
    timestamp = DateTimeField(auto_now_add=True)

import datetime
from PIL import Image as Img
import StringIO, json, os, re

from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField,
    ImageField, BooleanField, ForeignKey, OneToOneField, ManyToManyField, SlugField, SET_NULL, Manager, permalink)

from django.core.validators import MaxValueValidator
from django.conf import settings
from django.utils.functional import cached_property
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.template import loader, Context

from dispatch.helpers import ThemeHelper
from dispatch.apps.core.models import Person
from dispatch.apps.frontend.models import Script, Snippet, Stylesheet
from dispatch.apps.frontend.embeds import embedlib
from dispatch.apps.frontend.templates import TemplateManager

class Tag(Model):
    name = CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Topic(Model):
    name = CharField(max_length=255)

    def __str__(self):
        return self.name

class Section(Model):
    name = CharField(max_length=100, unique=True)
    slug = SlugField(unique=True)

    def __str__(self):
        return self.name

class Publishable(Model):

    parent = ForeignKey('Article', related_name='child', blank=True, null=True)
    preview = BooleanField(default=False)
    revision_id = PositiveIntegerField(default=0)
    head = BooleanField(default=False)

    # Overriding
    def save(self, revision=True, *args, **kwargs):
        if revision:
            self.head = True
            self.revision_id += 1

            if self.parent:
                Article.objects.filter(parent=self.parent,head=True).update(head=False)
                # Both fields required for this to work -- something to do with model inheritance.
                self.pk = None
                self.id = None

            if self.is_published():
                Article.objects.filter(parent=self.parent,status=Article.PUBLISHED).update(status=Article.DRAFT)
                if self.get_previous_revision().status != Article.PUBLISHED:
                    self.published_at = datetime.datetime.now()

        super(Publishable, self).save(*args, **kwargs)

        if not self.parent:
            self.parent = self
            super(Publishable, self).save(update_fields=['parent'])

        return self

    def get_previous_revision(self):
        if self.parent == self:
            return self
        try:
            revision = Article.objects.filter(parent=self.parent).order_by('-pk')[1]
            return revision
        except:
            return self

    def check_stale(self):
        if self.revision_id == 0:
            return (False, self)
        head = Article.objects.get(parent=self.parent, head=True)
        return (head.revision_id != self.revision_id, head)

    class Meta:
        abstract = True

class ArticleManager(Manager):

    def get(self, *args, **kwargs):
        if 'pk' in kwargs:
            kwargs['parent'] = kwargs['pk']
            kwargs['head'] = True
            del kwargs['pk']
        return super(ArticleManager, self).get(*args, **kwargs)

    def get_revision(self, *args, **kwargs):
        return super(ArticleManager, self).get(*args, **kwargs)

    def get_frontpage(self, reading_times=None, section=None, section_id=None):

        if reading_times is None:
            reading_times = {
                'morning_start': '11:00:00',
                'midday_start': '11:00:00',
                'midday_end': '16:00:00',
                'evening_start': '16:00:00',
            }

        context = {
            'section': section,
            'section_id': section_id,
        }

        context.update(reading_times)

        if section is not None:
            query = """
            SELECT *,
                TIMESTAMPDIFF(SECOND, published_at, NOW()) as age,
                CASE reading_time
                     WHEN 'morning' THEN IF( CURTIME() < %(morning_start)s, 1, 0 )
                     WHEN 'midday'  THEN IF( CURTIME() >= %(midday_start)s AND CURTIME() < %(midday_end)s, 1, 0 )
                     WHEN 'evening' THEN IF( CURTIME() >= %(evening_start)s, 1, 0 )
                     ELSE 0.5
                END as reading
                FROM content_article
                INNER JOIN content_section on content_article.section_id = content_section.id AND content_section.slug = %(section)s
                WHERE head = 1
                ORDER BY reading DESC, ( age * ( 1 / ( 4 * importance ) ) ) ASC
                LIMIT 7
            """
        elif section_id is not None:
            query = """
            SELECT *,
                TIMESTAMPDIFF(SECOND, published_at, NOW()) as age,
                CASE reading_time
                     WHEN 'morning' THEN IF( CURTIME() < %(morning_start)s, 1, 0 )
                     WHEN 'midday'  THEN IF( CURTIME() >= %(midday_start)s AND CURTIME() < %(midday_end)s, 1, 0 )
                     WHEN 'evening' THEN IF( CURTIME() >= %(evening_start)s, 1, 0 )
                     ELSE 0.5
                END as reading
                FROM content_article
                WHERE head = 1 AND status = 1 AND section_id = %(section_id)s
                ORDER BY reading DESC, ( age * ( 1 / ( 4 * importance ) ) ) ASC
                LIMIT 7
            """
        else:
            query = """
            SELECT *,
                TIMESTAMPDIFF(SECOND, published_at, NOW()) as age,
                CASE reading_time
                     WHEN 'morning' THEN IF( CURTIME() < %(morning_start)s, 1, 0 )
                     WHEN 'midday'  THEN IF( CURTIME() >= %(midday_start)s AND CURTIME() < %(midday_end)s, 1, 0 )
                     WHEN 'evening' THEN IF( CURTIME() >= %(evening_start)s, 1, 0 )
                     ELSE 0.5
                END as reading
                FROM content_article
                WHERE head = 1 AND status = 1
                ORDER BY reading DESC, ( age * ( 1 / ( 4 * importance ) ) ) ASC
                LIMIT 7
            """

        return self.raw(query, context)

    def get_sections(self, exclude=False, frontpage=[]):

        results = {}

        sections = Section.objects.all()

        for section in sections:
            articles = self.exclude(id__in=frontpage).filter(section=section,status=Article.PUBLISHED)[:5]
            if len(articles) > 0:
                results[section.slug] = {
                    'first': articles[0],
                    'stacked': articles[1:3],
                    'bullets': articles[3:],
                    'rest': articles[1:4],
                }

        return results

    def get_most_popular(self, count=10):
        return self.filter(head=True).order_by('-importance')[:count]

class Article(Publishable):
    long_headline = CharField(max_length=200)
    short_headline = CharField(max_length=100)
    section = ForeignKey('Section')

    is_active = BooleanField(default=True)
    published_at = DateTimeField(null=True)
    slug = SlugField()

    authors = ManyToManyField(Person, through="Author")

    topics = ManyToManyField('Topic')
    tags = ManyToManyField('Tag')
    shares = PositiveIntegerField(default=0, blank=True, null=True)

    IMPORTANCE_CHOICES = [(i,i) for i in range(1,6)]

    importance = PositiveIntegerField(validators=[MaxValueValidator(5)], choices=IMPORTANCE_CHOICES, default=3)

    DRAFT = 0
    PUBLISHED = 1
    PITCH = 2
    COPY = 3
    MANAGE = 4

    STATUS_CHOICES = (
        (DRAFT, 'Draft'),
        (PUBLISHED, 'Published'),
        (PITCH, 'Pitch'),
        (COPY, 'To be copyedited'),
        (MANAGE, 'To be managed'),
    )

    status = PositiveIntegerField(default=0, choices=STATUS_CHOICES)

    READING_CHOICES = (
        ('anytime', 'Anytime'),
        ('morning', 'Morning'),
        ('midday', 'Midday'),
        ('evening', 'Evening'),
    )

    reading_time = CharField(max_length=100, choices=READING_CHOICES, default='anytime')

    featured_image = ForeignKey('ImageAttachment', related_name="featured_image", blank=True, null=True)

    images = ManyToManyField("Image", through='ImageAttachment', related_name='images')
    videos = ManyToManyField('Video')

    template = CharField(max_length=255, default='default')

    scripts = ManyToManyField(Script, related_name='scripts')
    stylesheets = ManyToManyField(Stylesheet, related_name='stylesheets')
    snippets = ManyToManyField(Snippet, related_name='snippets')

    content = TextField()
    snippet = TextField()

    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    objects = ArticleManager()

    def __str__(self):
        return self.long_headline

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

    def get_template(self):
        if self.template != 'default':
            return 'article/%s.html' % self.template
        else:
            return 'article/base.html'

    def is_published(self):
        return self.status == self.PUBLISHED

    def get_status(self):
        for status in self.STATUS_CHOICES:
            if status[0] == self.status:
                return status[1]
        return 'Draft'

    def get_template_fields(self):
        Template = ThemeHelper.get_theme_template(template_slug=self.template)
        return Template(article_id=self.id).field_data_as_json()

    def save_template_fields(self, template_fields):
        return TemplateManager.save_fields(self.id, self.template, template_fields)

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
                ins = Tag.objects.get(id=int(tag))
                self.tags.add(ins)
            except Tag.DoesNotExist:
                pass

    def save_topics(self, topics):
        self.topics.clear()
        for topic in topics.split(","):
            try:
                ins = Topic.objects.get(name=topic)
            except Topic.DoesNotExist:
                ins = Topic.objects.create(name=topic)
            self.topics.add(ins)

    def get_json(self):
        """
        Returns a JSON representation (if possible) of the article content.
        """
        def prepare_json(nodes):
            """
            Processes each in the document, returning its full object representation.
            """
            for i, node in enumerate(nodes):
                if type(node) is dict:
                    # If node is a dictionary, replace data attribute with processed data.
                    nodes[i]['data'] = embedlib.json(node['type'], node['data'])
                else:
                    # If node isn't a dictionary, then it's assumed to be a paragraph.
                    nodes[i] = {
                        'type': 'paragraph',
                        'data': node,
                    }
            return nodes
        # Attempt to load content as JSON, return raw content as fallback
        try:
            return prepare_json(json.loads(self.content))
        except ValueError:
            return self.content

    def get_html(self):
        """
        Returns article content as HTML.
        """
        def prepare_html(nodes):
            """
            Processes each in the document, returning its rendered HTML representation.
            """
            html = ""
            for node in nodes:
                if type(node) is dict:
                    # If node is a dictionary, append its rendered HTML.
                    html += embedlib.render(node['type'], node['data'])
                else:
                    # If node isn't a dictionary, then it's assumed to be a paragraph.
                    html += "<p>%s</p>" % node
            return html

        try:
            # Attempt to load content as JSON, return raw content as fallback
            return prepare_html(json.loads(self.content))
        except ValueError:
            return self.content

    def save_attachments(self):
        """
        Saves all attachments embedded in article content.

        TODO: add abstraction to this function -- delegate saving to embed models/controllers.
        """
        nodes = json.loads(self.content)
        for node in nodes:
            if type(node) is dict and node['type'] == 'image':
                image_id = node['data']['image']['id']
                image = Image.objects.get(id=image_id)
                if node['data']['attachment_id']:
                    attachment = ImageAttachment.objects.get(id=node['data']['attachment_id'])
                else:
                    attachment = ImageAttachment()
                attachment.caption = node['data']['caption']
                attachment.image = image
                attachment.article = self
                attachment.save()
                del node['data']
                node['data'] = {
                    'attachment_id': attachment.id
                }
        self.content = json.dumps(nodes)

    def save_featured_image(self, data):
        attachment = ImageAttachment()
        attachment.image_id = data['id']
        if 'caption' in data:
            attachment.caption = data['caption']
        attachment.article = self
        attachment.save()
        self.featured_image = attachment

    def save_authors(self, authors):
        Author.objects.filter(article_id=self.id).delete()
        n=0
        if type(authors) is not list:
            authors = authors.split(",")
        for author in authors:
            try:
                person = Person.objects.get(id=author)
                Author.objects.create(article=self,person=person,order=n)
                n = n + 1
            except Person.DoesNotExist:
                pass

    def get_author_string(self):
        """
        Returns list of authors as a comma-separated string (with 'and' before last author).
        """
        author_str = ""
        authors = self.authors.order_by('author__order')
        n = 1
        for author in authors:
            if len(authors) > 0 and n + 1 == len(authors):
                # If this is the second last author in the list, follow author name with an 'and'
                author_str = author_str + author.full_name + " and "
            elif n == len(authors):
                # If this is the last author or only author in the list, just return author name
                author_str = author_str + author.full_name
            else:
                # If author is somewhere in the middle of the list, follow author name with a comma
                author_str = author_str + author.full_name + ", "
            n = n + 1
        return author_str

    def get_absolute_url(self):
        """
        Returns article URL.
        """
        return "%s%s/%s/" % (settings.BASE_URL, self.section.name.lower(), self.slug)


class Author(Model):
    article = ForeignKey(Article, null=True)
    image = ForeignKey('Image', null=True)
    person = ForeignKey(Person)
    order = PositiveIntegerField()

class Video(Model):
    title = CharField(max_length=255)
    url = CharField(max_length=500)

class Image(Model):
    img = ImageField(upload_to='images')
    title = CharField(max_length=255, blank=True, null=True)
    width = PositiveIntegerField(blank=True, null=True)
    height = PositiveIntegerField(blank=True, null=True)

    authors = ManyToManyField(Person, through="Author")

    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    SIZES = {
        'large': (1600, 900),
        'medium': (800, 600),
        'square': (250, 250)
    }

    THUMBNAIL_SIZE = 'square'

    def filename(self):
        """
        Returns the image filename.
        """
        return os.path.basename(self.img.name)

    def get_name(self):
        """
        Returns the image filename without extension.
        """
        return re.split('.(jpg|gif|png)', self.img.name)[0]

    def get_absolute_url(self):
        """
        Returns the full size image URL.
        """
        return settings.MEDIA_URL + str(self.img)

    def get_medium_url(self):
        """
        Returns the medium size image URL.
        """
        return "%s%s-%s.jpg" % (settings.MEDIA_URL, self.get_name(), 'medium')

    def get_thumbnail_url(self):
        """
        Returns the thumbnail URL.
        """
        return "%s%s-%s.jpg" % (settings.MEDIA_URL, self.get_name(), self.THUMBNAIL_SIZE)

    def get_wide_url(self):
        return "%s%s-%s.jpg" % (settings.MEDIA_URL, self.get_name(), 'wide')

    #Overriding
    def save(self, thumbnails=True, **kwargs):
        """
        Custom save method to process thumbnails and save image dimensions.
        """

        # Call super method
        super(Image, self).save()

        if self.img and thumbnails:
            image = Img.open(StringIO.StringIO(self.img.read()))
            self.width, self.height = image.size
            super(Image, self).save()
            name = re.split('.(jpg|gif|png)', self.img.name)[0]

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

    def save_authors(self, authors):
        Author.objects.filter(image_id=self.id).delete()
        n=0
        if type(authors) is not list:
            authors = authors.split(",")
        for author in authors:
            try:
                person = Person.objects.get(id=author)
                Author.objects.create(image=self,person=person,order=n)
                n = n + 1
            except Person.DoesNotExist:
                pass

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
    NORMAL = 'normal'
    FILE = 'file'
    COURTESY = 'courtesy'
    TYPE_CHOICES = (
        (NORMAL, 'Normal'),
        (FILE, 'File photo'),
        (COURTESY, 'Courtesy photo'),
    )
    TYPE_DISPLAYS = (
        (NORMAL, 'Photo'),
        (FILE, 'File photo'),
        (COURTESY, 'Photo courtesy'),
    )

    article = ForeignKey(Article, blank=True, null=True)
    gallery = ForeignKey('ImageGallery', blank=True, null=True)
    caption = CharField(max_length=255, blank=True, null=True)
    image = ForeignKey(Image, related_name='image', on_delete=SET_NULL, null=True)
    type = CharField(max_length=255, choices=TYPE_CHOICES, default=NORMAL, null=True)
    order = PositiveIntegerField(null=True)

    def get_credit(self):
        """
        TODO: fix this
        """
        #author = self.image.authors.all()[0]
        author = "Peter Siemens"
        types = dict((x, y) for x, y in self.TYPE_DISPLAYS)
        return "%s %s" % (types[self.type], author)

    class EmbedController:
        @staticmethod
        def json(data):
            id = data['attachment_id']
            attach = ImageAttachment.objects.get(id=id)
            return {
                'id': attach.image.id,
                'url': attach.image.get_absolute_url(),
                'caption': attach.caption,
                'credit': attach.get_credit(),
                'width': attach.image.width,
                'height': attach.image.height,
            }

        @staticmethod
        def render(data):
            template = loader.get_template("image.html")
            id = data['attachment_id']
            attach = ImageAttachment.objects.get(id=id)
            c = Context({
                'id': attach.id,
                'src': attach.image.get_absolute_url(),
                'caption': attach.caption,
                'credit': attach.get_credit(),
            })
            return template.render(c)

    embedlib.register('image', EmbedController)

class ImageGallery(Model):
    title = CharField(max_length=255)
    images = ManyToManyField(ImageAttachment, related_name="images")

    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    def save_attachments(self, attachments):
        self.images.clear()
        ImageAttachment.objects.filter(gallery=self).delete()
        for attachment in attachments:
            attachment_obj = ImageAttachment(gallery=self, caption=attachment['caption'], image_id=attachment['image_id'])
            attachment_obj.save()
            self.images.add(attachment_obj)

    class EmbedController:
        @staticmethod
        def json(data):
            return data

        @staticmethod
        def render(data):
            template = loader.get_template("article/embeds/gallery.html")
            id = data['id']
            gallery = ImageGallery.objects.get(id=id)
            images = gallery.images.all()
            c = Context({
                'id': gallery.id,
                'title': gallery.title,
                'cover': images[0],
                'thumbs': images[1:5],
                'images': images,
                'size': len(images)
            })
            return template.render(c)

    embedlib.register('gallery', EmbedController)
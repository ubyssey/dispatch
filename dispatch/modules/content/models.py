import datetime
from PIL import Image as Img
import StringIO, json, os, re
from string import punctuation

from django.db import IntegrityError
from django.db.models import (
    Model, DateTimeField, CharField, TextField, PositiveIntegerField,
    ImageField, FileField, BooleanField, ForeignKey, OneToOneField, ManyToManyField, SlugField, SET_NULL, Manager, permalink)

from django.core.validators import MaxValueValidator
from django.conf import settings
from django.utils.functional import cached_property
from django.utils import timezone
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.template import loader, Context

from dispatch.helpers import ThemeHelper
from dispatch.apps.core.models import Person, User
from dispatch.apps.frontend.models import Script, Snippet, Stylesheet
from dispatch.apps.frontend.embeds import embedlib
from dispatch.apps.frontend.templates import TemplateManager

class Tag(Model):
    name = CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Topic(Model):
    name = CharField(max_length=255)
    last_used = DateTimeField(null=True)

    def update_timestamp(self):
        self.last_used = datetime.datetime.now()
        self.save()

    def __str__(self):
        return self.name

class Section(Model):
    name = CharField(max_length=100, unique=True)
    slug = SlugField(unique=True)

    def __str__(self):
        return self.name

class PublishableManager(Manager):

    def get(self, *args, **kwargs):
        if 'pk' in kwargs:
            kwargs['parent'] = kwargs['pk']
            kwargs['head'] = True
            del kwargs['pk']
        return super(PublishableManager, self).get(*args, **kwargs)

    def get_revision(self, *args, **kwargs):
        return super(PublishableManager, self).get(*args, **kwargs)

class Publishable(Model):

    preview = BooleanField(default=False)
    revision_id = PositiveIntegerField(default=0)
    head = BooleanField(default=False)

    is_published = BooleanField(default=False)

    is_active = BooleanField(default=True)
    slug = SlugField(max_length=255)

    shares = PositiveIntegerField(default=0, blank=True, null=True)
    views = PositiveIntegerField(default=0)

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
    published_at = DateTimeField(null=True)

    featured_image = ForeignKey('ImageAttachment', related_name='%(class)s_featured_image', blank=True, null=True)

    images = ManyToManyField("Image", through='ImageAttachment', related_name='%(class)s_images')
    videos = ManyToManyField('Video', related_name='%(class)s_videos')

    template = CharField(max_length=255, default='default')

    seo_keyword = CharField(max_length=100, null=True)
    seo_description = TextField(null=True)

    scripts = ManyToManyField(Script, related_name='%(class)s_scripts')
    stylesheets = ManyToManyField(Stylesheet, related_name='%(class)s_stylesheets')
    snippets = ManyToManyField(Snippet, related_name='%(class)s_snippets')

    content = TextField()
    snippet = TextField(null=True)

    created_at = DateTimeField()
    updated_at = DateTimeField(auto_now=True)

    def add_view(self):
        self.views += 1
        self.save(revision=False)

    def template_fields(self):
        if not hasattr(self, 'template_fields_data'):
            self.template_fields_data = self.get_template_fields()
        return self.template_fields_data

    def get_template(self):
        if self.template != 'default':
            return 'article/%s.html' % self.template
        else:
            return 'article/base.html'

    def save_template_fields(self, template_fields):
        return TemplateManager.save_fields(self.id, self.template, template_fields)

    def get_template_fields(self):
        Template = ThemeHelper.get_theme_template(template_slug=self.template)
        return Template(article_id=self.id).field_data_as_json()

    def get_status(self):
        for status in self.STATUS_CHOICES:
            if status[0] == self.status:
                return status[1]
        return 'Draft'

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

    def is_parent(self):
        return self.parent is None

    def publish(self):
        # Unpublish last published version
        type(self).objects.filter(parent=self.parent, is_published=True).update(is_published=False)
        self.is_published = True
        if self.published_at is None:
            self.published_at = datetime.datetime.now()
        self.save(revision=False)
        return self

    def unpublish(self):
        self.is_published = False
        self.save(revision=False)
        return self

    # Overriding
    def save(self, revision=True, *args, **kwargs):

        if revision:
            # If this is a revision, set it to be the head of the list and increment the revision id.
            self.head = True
            self.revision_id += 1

            previous_revision = self.get_previous_revision()

            if not self.is_parent():
                # If this is a revision, delete the old head of the list.
                type(self).objects.filter(parent=self.parent, head=True).update(head=False)

                # Clear the instance id to force Django to save a new instance.
                # Both fields (pk, id) required for this to work -- something to do with model inheritance.
                self.pk = None
                self.id = None
                self.is_published = False

        # Raise integrity error if instance with given slug already exists.
        if type(self).objects.filter(slug=self.slug).exclude(parent=self.parent).exists():
            raise IntegrityError("%s with slug '%s' already exists." % (type(self).__name__, self.slug))

        # Set created_at to now, but only for first version
        if self.created_at is None:
            self.created_at = timezone.now()

        super(Publishable, self).save(*args, **kwargs)

        # Update the parent foreign key
        if not self.parent:
            self.parent = self
            super(Publishable, self).save(update_fields=['parent'])

        return self

    def get_published_version(self):
        try:
            published = type(self).objects.get(parent=self.parent, is_published=True)
            return published.revision_id
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

    def check_stale(self):
        if self.revision_id == 0:
            return (False, self)
        head = type(self).objects.get(parent=self.parent, head=True)
        return (head.revision_id != self.revision_id, head)

    class Meta:
        abstract = True

class ArticleManager(PublishableManager):

    def get_frontpage(self, reading_times=None, section=None, section_id=None, sections=[], exclude=[], limit=7, is_published=True):

        if is_published:
            is_published = 1
        else:
            is_published = 0

        if reading_times is None:
            reading_times = {
                'morning_start': '9:00:00',
                'midday_start': '11:00:00',
                'midday_end': '16:00:00',
                'evening_start': '16:00:00',
            }

        context = {
            'section': section,
            'section_id': section_id,
            'excluded': ",".join(map(str, exclude)),
            'sections': ",".join(sections),
            'limit': limit,
            'is_published': is_published
        }

        context.update(reading_times)

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
        """

        query_where = "WHERE head = 1 AND is_published = %(is_published)s AND parent_id NOT IN (%(excluded)s) "

        if section is not None:
            query += """
                INNER JOIN content_section on content_article.section_id = content_section.id AND content_section.slug = %(section)s
            """
        elif section_id is not None:
            query_where += " AND section_id = %(section_id)s "
        elif sections:
            query += """
                INNER JOIN content_section on content_article.section_id = content_section.id AND FIND_IN_SET(content_section.slug, %(sections)s)
            """

        query += query_where + """
            ORDER BY reading DESC, ( age * ( 1 / ( 4 * importance ) ) ) ASC
            LIMIT %(limit)s
        """

        return self.raw(query, context)

    def get_sections(self, exclude=None, frontpage=[]):

        results = {}

        sections = Section.objects.all()

        for section in sections:
            articles = self.exclude(id__in=frontpage).filter(section=section,is_published=True).order_by('-published_at')[:5]
            if len(articles) > 0:
                results[section.slug] = {
                    'first': articles[0],
                    'stacked': articles[1:3],
                    'bullets': articles[3:],
                    'rest': articles[1:4],
                }

        return results

    def get_popular(self, dur=None):
        time = False
        if dur is not None:
            if dur == 'week':
                time = datetime.datetime.now() - datetime.timedelta(days=7)

        if time:
            articles = Article.objects.filter(is_published=True, updated_at__gt=time)
        else:
            articles = Article.objects.filter(is_published=True)

        return articles.order_by('-views')

class Comment(Model):
    article = ForeignKey('Article')

    user = ForeignKey(User)
    content = TextField()

    votes = PositiveIntegerField(default=0)

    created_at = DateTimeField(auto_now_add=True)

class Article(Publishable):

    parent = ForeignKey('Article', related_name='article_parent', blank=True, null=True)

    headline = CharField(max_length=255)
    section = ForeignKey('Section')
    authors = ManyToManyField(Person, through="Author")
    topic = ForeignKey('Topic', null=True)
    tags = ManyToManyField('Tag')

    IMPORTANCE_CHOICES = [(i,i) for i in range(1,6)]

    importance = PositiveIntegerField(validators=[MaxValueValidator(5)], choices=IMPORTANCE_CHOICES, default=3)

    est_reading_time = PositiveIntegerField(null=True)

    READING_CHOICES = (
        ('anytime', 'Anytime'),
        ('morning', 'Morning'),
        ('midday', 'Midday'),
        ('evening', 'Evening'),
    )

    reading_time = CharField(max_length=100, choices=READING_CHOICES, default='anytime')

    objects = ArticleManager()

    def __str__(self):
        return self.headline

    def tags_list(self):
        return ",".join(self.tags.values_list('name', flat=True))

    def topics_list(self):
        return ",".join(self.topics.values_list('name', flat=True))

    def images_list(self):
        return ",".join([str(i) for i in self.images.values_list('id', flat=True)])

    def comment_count(self):
        return Comment.objects.filter(article_id=self.parent.id).count()

    def get_authors(self):
        return self.authors.order_by('author__order')

    def authors_list(self):
        return ",".join([str(i) for i in self.get_authors().values_list('id', flat=True)])

    def get_related(self):
        return Article.objects.exclude(pk=self.id).filter(section=self.section,is_published=True)[:5]

    def get_reading_list(self, ref=None, dur=None):
        if ref is not None:
            if ref == 'frontpage':
                articles = Article.objects.get_frontpage(exclude=[self.parent_id])
                name = 'Top Stories'
            elif ref == 'popular':
                articles = Article.objects.get_popular(dur=dur).exclude(pk=self.id)[:5]
                name = "Most popular this week"
        else:
            articles = self.get_related()
            name = self.section.name

        return {
            'ids': ",".join([str(a.parent_id) for a in articles]),
            'name': name
        }


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
                attachment.set_custom_credit(node['data'])
                attachment.save()
                node['data'] = {
                    'attachment_id': attachment.id,
                }

        self.content = json.dumps(nodes)

    def save_featured_image(self, data):
        attachment = ImageAttachment()
        attachment.image_id = data['id']
        if 'caption' in data:
            attachment.caption = data['caption']
        attachment.set_custom_credit(data)
        attachment.article = self
        attachment.save()
        self.featured_image = attachment

    def save_related(self, data):
        tags = data["tags-list"]
        authors = data["authors-list"]
        if tags:
            self.save_tags(tags)
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

    def save_topic(self, topic_id):
        try:
            topic = Topic.objects.get(id=int(topic_id))
            topic.update_timestamp()
            self.topic = topic
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

    def calc_est_reading_time(self):

        def count_words(string):
            r = re.compile(r'[{}]'.format(punctuation))
            new_string = r.sub(' ', string)
            return len(new_string.split())

        words = 0

        for node in json.loads(self.content):
            if type(node) is unicode:
                words += count_words(node)

        return int(words / 200) # Average reading speed = 200 wpm

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
        return "%s%s/%s/" % (settings.BASE_URL, self.section.name.lower(), self.slug)

class Page(Publishable):
    parent = ForeignKey('Page', related_name='page_parent', blank=True, null=True)
    parent_page = ForeignKey('Page', related_name='parent_page_fk', null=True)
    title = CharField(max_length=255)


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
                attachment.set_custom_credit(node['data'])
                attachment.image = image
                attachment.page = self
                attachment.save()
                node['data'] = {
                    'attachment_id': attachment.id,
                }

        self.content = json.dumps(nodes)

    def save_featured_image(self, data):
        attachment = ImageAttachment()
        attachment.image_id = data['id']
        if 'caption' in data:
            attachment.caption = data['caption']
        attachment.set_custom_credit(data)
        attachment.page = self
        attachment.save()
        self.featured_image = attachment

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

    authors = ManyToManyField(Person, through="Author", related_name="authors")

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

    article = ForeignKey(Article, blank=True, null=True, related_name='article')
    page = ForeignKey(Page, blank=True, null=True, related_name='page')
    gallery = ForeignKey('ImageGallery', blank=True, null=True)

    caption = TextField(blank=True, null=True)
    custom_credit = TextField(blank=True, null=True)
    image = ForeignKey(Image, related_name='image', on_delete=SET_NULL, null=True)
    type = CharField(max_length=255, choices=TYPE_CHOICES, default=NORMAL, null=True)
    order = PositiveIntegerField(null=True)

    def get_credit(self):
        if self.custom_credit is not None:
            return self.custom_credit
        else:
            try:
                author = self.image.authors.all()[0]
                types = dict((x, y) for x, y in self.TYPE_DISPLAYS)
                return "%s %s" % (types[self.type], author)
            except:
                return None

    def has_custom_credit(self):
        return self.custom_credit is not None

    def set_custom_credit(self, data):
        if 'custom_credit' in data and data['custom_credit'] is not None:
            if data['custom_credit'].strip() == "":
                # Remove custom credit if blank
                self.custom_credit = None
            else:
                self.custom_credit = data['custom_credit']

    class EmbedController:
        @staticmethod
        def json(data):
            id = data['attachment_id']
            attach = ImageAttachment.objects.get(id=id)

            if attach.image is None:
                return

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
                'credit': data['custom_credit'] if 'custom_credit' in data and data['custom_credit'] is not None else attach.get_credit()
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
            try:
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
            except:
                return "Gallery not found"

    embedlib.register('gallery', EmbedController)


class File(Model):

    name = CharField(max_length=255)
    file = FileField(upload_to='files/%Y/%m')
    tag = CharField(max_length=100)

    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

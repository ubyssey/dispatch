from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueValidator

from django.conf import settings
import json

from dispatch.modules.content.models import (
    Article, Image, ImageAttachment, ImageGallery, Issue,
    File, Page, Author, Section, Tag, Topic, Video,
    VideoAttachment, Poll, PollAnswer, PollVote, Subsection)
from dispatch.modules.auth.models import Person, User, Invite
from dispatch.modules.podcasts.models import Podcast, PodcastEpisode

from dispatch.admin.registration import send_invitation
from dispatch.theme.exceptions import WidgetNotFound, InvalidField

from dispatch.api.mixins import DispatchModelSerializer, DispatchPublishableSerializer
from dispatch.api.validators import (
    FilenameValidator, ImageGalleryValidator, PasswordValidator,
    SlugValidator, AuthorValidator, TemplateValidator, SectionValidator)
from dispatch.api.fields import JSONField, NullBooleanField, PrimaryKeyField, ForeignKeyField

class PersonSerializer(DispatchModelSerializer):
    """Serializes the Person model."""

    image = serializers.ImageField(required=False, validators=[FilenameValidator], write_only=True)
    image_url = serializers.CharField(source='get_absolute_image_url', read_only=True)

    class Meta:
        model = Person
        fields = (
            'id',
            'full_name',
            'title',
            'slug',
            'description',
            'image',
            'image_url',
            'twitter_url',
            'facebook_url'
        )

class AuthorSerializer(DispatchModelSerializer):
    """Serializes the Author model."""

    person = PersonSerializer()

    class Meta:
        model = Author
        fields = (
            'id',
            'person',
            'type'
        )

class UserSerializer(DispatchModelSerializer):
    """Serializes the User model."""

    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    person = ForeignKeyField(
        model=Person,
        serializer=PersonSerializer(),
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password_a = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
        validators=[PasswordValidator(confirm_field='password_b')]
    )
    password_b = serializers.CharField(required=False, allow_blank=True, write_only=True)

    permissions = serializers.CharField(source='get_permissions', read_only=True)

    permission_level = serializers.CharField(required=False, allow_null=True, write_only=True)

    user_id = serializers.IntegerField(source='get_user_id', read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'person',
            'password_a',
            'password_b',
            'permissions',
            'permission_level',
            'user_id'
        )

    def create(self, validated_data):
        instance = User.objects.create_user(validated_data['email'], validated_data['password_a'], validated_data['permission_level'])
        return self.update(instance, validated_data)

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.person = validated_data.get('person', instance.person)

        if validated_data.get('password_a'):
            instance.set_password(validated_data['password_a'])

        instance.save()

        permissions = validated_data.get('permission_level')
        instance.modify_permissions(permissions)

        return instance

class InviteSerializer(DispatchModelSerializer):
    """Serializes the Invite model."""

    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    person = ForeignKeyField(
        model=Person,
        serializer=PersonSerializer(),
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    permissions = serializers.CharField(
        required=False,
        allow_blank=True
    )

    expiration_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Invite
        fields = (
            'id',
            'email',
            'person',
            'permissions',
            'expiration_date'
        )

    def create(self, validated_data):
        instance = Invite()
        return self.update(instance, validated_data)

    def update(self, instance, validated_data):
        send_invitation(validated_data['email'], instance.id)
        return super(InviteSerializer, self).update(instance, validated_data)

class FileSerializer(DispatchModelSerializer):
    """Serializes the File model."""

    file = serializers.FileField(write_only=True, validators=[FilenameValidator])
    url = serializers.CharField(source='get_absolute_url', read_only=True)

    class Meta:
        model = File
        fields = (
            'id',
            'name',
            'file',
            'url',
            'created_at',
            'updated_at'
        )

class IssueSerializer(DispatchModelSerializer):
    """Serializes the Issue model."""

    file = serializers.FileField(write_only=True, validators=[FilenameValidator])
    file_str = serializers.FileField(source='file', read_only=True, use_url=False)

    img = serializers.ImageField(write_only=True, validators=[FilenameValidator])
    img_str = serializers.ImageField(source='img', read_only=True, use_url=False)

    url = serializers.CharField(source='get_absolute_url', read_only=True)

    class Meta:
        model = Issue
        fields = (
            'id',
            'title',
            'file',
            'file_str',
            'img',
            'img_str',
            'volume',
            'issue',
            'url',
            'date',
        )

class TagSerializer(DispatchModelSerializer):
    """Serializes the Tag model."""

    class Meta:
        model = Tag
        fields = (
            'id',
            'name',
        )

class VideoSerializer(DispatchModelSerializer):
    """Serializes the Video model."""

    title = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    url = serializers.CharField(required=True, allow_null=True, allow_blank=False)

    authors = AuthorSerializer(many=True, read_only=True)
    author_ids = serializers.ListField(
        write_only=True,
        allow_empty=False,
        required=True,
        child=serializers.JSONField(),
        validators=[AuthorValidator(True)])

    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(
        write_only=True,
        required=False,
        child=serializers.IntegerField())
        
    class Meta:
        model = Video
        fields = (
            'id',
            'title',
            'url',
            'authors',
            'author_ids',
            'tags',
            'tag_ids',
            'created_at',
            'updated_at'
        )

    def create(self, validated_data):
        return self.update(Video(), validated_data)

    def update(self, instance, validated_data):
        instance = super(VideoSerializer, self).update(instance, validated_data)

        # Save authors
        authors = validated_data.get('author_ids')
        if authors:
            instance.save_authors(authors)

        tag_ids = validated_data.get('tag_ids', False)
        if tag_ids != False:
            instance.save_tags(tag_ids)

        return instance

class ImageSerializer(serializers.HyperlinkedModelSerializer):
    """Serializes the Image model."""

    img = serializers.ImageField(write_only=True, validators=[FilenameValidator])
    filename = serializers.CharField(source='get_filename', read_only=True)

    title = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    url = serializers.CharField(source='get_absolute_url', read_only=True)
    url_medium = serializers.CharField(source='get_medium_url', read_only=True)
    url_thumb = serializers.CharField(source='get_thumbnail_url', read_only=True)

    authors = AuthorSerializer(many=True, read_only=True)
    author_ids = serializers.ListField(
        write_only=True,
        allow_empty=False,
        required=True,
        child=serializers.JSONField(),
        validators=[AuthorValidator(False)])

    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(
        write_only=True,
        required=False)

    width = serializers.IntegerField(read_only=True)
    height = serializers.IntegerField(read_only=True)

    class Meta:
        model = Image
        fields = (
            'id',
            'img',
            'filename',
            'title',
            'authors',
            'author_ids',
            'tags',
            'tag_ids',
            'url',
            'url_medium',
            'url_thumb',
            'width',
            'height',
            'created_at',
            'updated_at'
        )

    def create(self, validated_data):
        return self.update(Image(), validated_data)

    def update(self, instance, validated_data):
        instance = super(ImageSerializer, self).update(instance, validated_data)

        # Save authors
        
        authors = validated_data.get('author_ids')
        
        if authors and isinstance(authors, list) and len(authors) == 1 and isinstance(authors[0], str):
            authors = authors[0][1:-1].replace('},{', '};;{').split(';;')
            authors = [json.loads(author) for author in authors]

        if authors:
            instance.save_authors(authors)

        tag_ids = validated_data.get('tag_ids', False)

        if tag_ids and isinstance(tag_ids, list) and len(tag_ids) == 1 and isinstance(tag_ids[0], str):
            tag_ids = [int(tag) for tag in tag_ids[0].split(',')]

        if tag_ids != False:
            instance.save_tags(tag_ids)

        return instance

class TopicSerializer(DispatchModelSerializer):
    """Serializes the Topic model."""

    class Meta:
        model = Topic
        fields = (
            'id',
            'name',
        )

class VideoAttachmentSerializer(DispatchModelSerializer):
    """Serializes the ImageAttachment model without including full Image instance."""

    video = VideoSerializer(read_only=True)
    video_id =  serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = VideoAttachment
        fields = (
            'video',
            'video_id',
            'caption',
            'credit'
        )

class ImageAttachmentSerializer(DispatchModelSerializer):
    """Serializes the ImageAttachment model without including full Image instance."""

    image = ImageSerializer(read_only=True)
    image_id =  serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = ImageAttachment
        fields = (
            'image',
            'image_id',
            'style',
            'width',
            'caption',
            'credit'
        )

class ImageGallerySerializer(DispatchModelSerializer):
    """Serializes the ImageGallery model without including full Image instance."""

    images = ImageAttachmentSerializer(read_only=True, many=True)
    attachment_json = JSONField(
        required=False,
        write_only=True,
        validators=[ImageGalleryValidator])

    class Meta:
        model = ImageGallery
        fields = (
            'id',
            'title',
            'images',
            'attachment_json'
        )

    def create(self, validated_data):
        # Create new ImageGallery instance
        instance = ImageGallery()

        # Then save as usual
        return self.update(instance, validated_data)

    def update(self, instance, validated_data):
        # Update all the basic fields
        instance.title = validated_data.get('title', instance.title)

        # Save instance before processing/saving content in order to
        # save associations to correct ID
        instance.save()

        attachment_json = validated_data.get('attachment_json', False)

        if isinstance(attachment_json, list):
            instance.save_attachments(attachment_json)

        return instance

class SectionSerializer(DispatchModelSerializer):
    """Serializes the Section model."""

    class Meta:
        model = Section
        fields = (
            'id',
            'name',
            'slug',
        )

class FieldSerializer(serializers.Serializer):
    type = serializers.CharField(required=False)
    name = serializers.CharField()
    label = serializers.CharField()
    many = serializers.BooleanField()
    widgets = serializers.JSONField(required=False)
    options = serializers.ListField(required=False)

class TemplateSerializer(serializers.Serializer):
    id = serializers.SlugField()
    name = serializers.CharField(read_only=True)
    fields = serializers.ListField(read_only=True, child=FieldSerializer())

class ImageEmbedSerializer(serializers.Serializer):
    def serialize(self, instance):
        """Return serialized image data."""

        return ImageSerializer(instance).data

    def get_id(self, data):
        """Returns the id for an image instance."""
        return data['image_id']

    def fetch(self, ids):
        """Returns a dictionary of ids to Image instances with prefetched Authors"""
        return Image.objects \
            .prefetch_related('authors') \
            .in_bulk(ids)

    def to_internal_value(self, data):
        if 'image' in data:
            del data['image']
        return data

class ImageGalleryEmbedSerializer(serializers.Serializer):
    def serialize(self, instance):
        """Return serialized image gallery data."""
        return ImageGallerySerializer(instance).data

    def get_id(self, data):
        """Returns the id for a gallery instance."""
        return data['id']

    def fetch(self, ids):
        """Returns a dictionary of ids to ImageGallery instances with prefetched Authors"""
        return ImageGallery.objects \
            .prefetch_related('images__image__authors') \
            .in_bulk(ids)

    def to_internal_value(self, data):
        if 'gallery' in data:
            del data['gallery']
        return data

class ContentSerializer(serializers.Serializer):
    # Connect serializers with their corresponding embed types
    serializers = {
        'image': ImageEmbedSerializer(),
        'gallery': ImageGalleryEmbedSerializer()
    }

    def __init__(self, *args, **kwargs):
        self.ids = {}
        self.instances = {}

        super(ContentSerializer, self).__init__(*args, **kwargs)

    def to_representation(self, content):
        self.queue_data(content)
        self.load_data()
        data = self.insert_data(content)

        return data

    def to_internal_value(self, content):
        """Convert each block in `content` to its internal value before saving."""
        return list(map(self.sanitize_block, content))

    def sanitize_block(self, block):
        """Santizes the data for the given block.
        If block has a matching embed serializer, use the `to_internal_value` method."""

        embed_type = block.get('type', None)
        data = block.get('data', {})
        serializer = self.serializers.get(embed_type, None)

        if serializer is None:
            return block

        block['data'] = serializer.to_internal_value(data)

        return block

    def queue_instance(self, embed_type, data):
        """Queue an instance to be fetched from the database."""

        serializer = self.serializers.get(embed_type, None)

        if serializer is None:
            return

        instance_id = serializer.get_id(data)

        if embed_type not in self.ids:
            self.ids[embed_type] = []

        self.ids[embed_type].append(instance_id)

    def load_instances(self, embed_type, ids):
        """Fetch all queued instances of type `embed_type`, save results
        to `self.instances`"""

        serializer = self.serializers.get(embed_type, None)

        if serializer is None:
            return

        self.instances[embed_type] = serializer.fetch(ids)

    def insert_instance(self, block):
        """Insert a fetched instance into embed block."""

        embed_type = block.get('type', None)
        data = block.get('data', {})
        serializer = self.serializers.get(embed_type, None)

        if serializer is None:
            return block

        try:
            instance_id = serializer.get_id(data)
            instance = self.instances[embed_type][instance_id]
            data[embed_type] = serializer.serialize(instance)
        except:
            data[embed_type] = None

        block['data'] = data

        return block

    def queue_data(self, content):
        """Queue data to be loaded for each embed block."""

        for block in content:
            self.queue_instance(block['type'], block['data'])

    def load_data(self):
        """Load data in bulk for each embed block."""

        for embed_type in list(self.ids.keys()):
            self.load_instances(embed_type, self.ids[embed_type])

    def insert_data(self, content):
        """Insert loaded data into embed data blocks."""

        return list(map(self.insert_instance, content))

class SubsectionArticleSerializer(DispatchModelSerializer):
    """Serializes articles for the Subsection model"""
    id = serializers.ReadOnlyField(source='parent_id')
    authors = AuthorSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = (
            'id',
            'headline',
            'authors',
            'published_version'
        )

class SubsectionSerializer(DispatchModelSerializer):
    """Serializes the Subsection model"""

    authors = AuthorSerializer(many=True, read_only=True)
    author_ids = serializers.ListField(
        write_only=True,
        child=serializers.JSONField(),
        validators=[AuthorValidator(False)]
    )
    authors_string = serializers.CharField(source='get_author_string', read_only=True)
    articles = SubsectionArticleSerializer(many=True, read_only=True, source='get_articles')
    article_ids = serializers.ListField(
        write_only=True,
        child=serializers.JSONField(),
        required=False
    )
    section = SectionSerializer(read_only=True)
    section_id = serializers.IntegerField(write_only=True)

    slug = serializers.SlugField(validators=[SlugValidator()])

    class Meta:
        model = Subsection
        fields = (
            'id',
            'is_active',
            'name',
            'section',
            'section_id',
            'slug',
            'description',
            'authors',
            'author_ids',
            'authors_string',
            'articles',
            'article_ids'
        )

    def create(self, validated_data):
        instance = Subsection()
        return self.update(instance, validated_data)

    def update(self, instance, validated_data):
        # Update basic fields
        instance.name = validated_data.get('name', instance.name)
        instance.slug = validated_data.get('slug', instance.slug)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.section_id = validated_data.get('section_id', instance.section_id)
        instance.description = validated_data.get('description', instance.description)

        # Save instance before processing/saving content in order to save associations to correct ID
        instance.save()

        authors = validated_data.get('author_ids')

        instance.save_authors(authors, is_publishable=False)

        article_ids = validated_data.get('article_ids')

        instance.save_articles(article_ids)

        return instance

class ArticleSerializer(DispatchModelSerializer, DispatchPublishableSerializer):
    """Serializes the Article model."""

    id = serializers.ReadOnlyField(source='parent_id')
    slug = serializers.SlugField(validators=[SlugValidator()])

    is_published = NullBooleanField(read_only=True)

    section = SectionSerializer(read_only=True)
    section_id = serializers.IntegerField(write_only=True)

    subsection = SubsectionSerializer(source='get_subsection', read_only=True)
    subsection_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    featured_image = ImageAttachmentSerializer(required=False, allow_null=True)
    featured_video = VideoAttachmentSerializer(required=False, allow_null=True)

    content = ContentSerializer()

    authors = AuthorSerializer(many=True, read_only=True)
    author_ids = serializers.ListField(
        write_only=True,
        allow_empty=False,
        required=True,
        child=serializers.JSONField(),
        validators=[AuthorValidator(False)])
    authors_string = serializers.CharField(source='get_author_string', read_only=True)

    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(
        write_only=True,
        required=False,
        child=serializers.IntegerField())

    topic = TopicSerializer(read_only=True)
    topic_id = serializers.IntegerField(
        write_only=True,
        allow_null=True,
        required=False)

    url = serializers.CharField(source='get_absolute_url', read_only=True)

    current_version = serializers.IntegerField(read_only=True, source='revision_id')

    template = TemplateSerializer(required=False, source='get_template')
    template_id = serializers.CharField(required=False, write_only=True)
    template_data = JSONField(required=False)

    integrations = JSONField(required=False)

    currently_breaking = serializers.BooleanField(source='is_currently_breaking', read_only=True)
    
    class Meta:
        model = Article
        fields = (
            'id',
            'slug',
            'url',
            'headline',
            'featured_image',
            'featured_video',
            'snippet',
            'content',
            'authors',
            'author_ids',
            'tags',
            'tag_ids',
            'topic',
            'topic_id',
            'authors_string',
            'section',
            'section_id',
            'subsection',
            'subsection_id',
            'published_at',
            'is_published',
            'is_breaking',
            'breaking_timeout',
            'currently_breaking',
            'published_version',
            'current_version',
            'latest_version',
            'preview_id',
            'importance',
            'reading_time',
            'template',
            'template_id',
            'template_data',
            'seo_keyword',
            'seo_description',
            'integrations'
        )
        authenticated_fields = (
            'template',
            'integrations',
            'preview_id'
        )

    def create(self, validated_data):
        instance = Article()
        return self.update(instance, validated_data)

    def update(self, instance, validated_data):
        template = validated_data.get('template_id', instance.template)
        template_data = validated_data.get('template_data', instance.template_data)
        tag_ids = validated_data.get('tag_ids', False)

        tags = []
        if tag_ids != False:
            for tag_id in tag_ids:
                try:
                    tags.append(Tag.objects.get(id=int(tag_id)))
                except Tag.DoesNotExist:
                    pass
        subsection_id = validated_data.get('subsection_id', None)
        TemplateValidator(template, template_data, tags, subsection_id)

        section_id = validated_data.get('section_id', instance.section_id)
        SectionValidator(section_id, subsection_id, template, tags)

        # Update basic fields
        instance.headline = validated_data.get('headline', instance.headline)
        instance.section_id = section_id
        instance.slug = validated_data.get('slug', instance.slug)
        instance.snippet = validated_data.get('snippet', instance.snippet)
        instance.reading_time = validated_data.get('reading_time', instance.reading_time)
        instance.importance = validated_data.get('importance', instance.importance)
        instance.is_breaking = validated_data.get('is_breaking', instance.is_breaking)
        instance.breaking_timeout = validated_data.get('breaking_timeout', instance.breaking_timeout)
        instance.seo_keyword = validated_data.get('seo_keyword', instance.seo_keyword)
        instance.seo_description = validated_data.get('seo_description', instance.seo_description)
        instance.integrations = validated_data.get('integrations', instance.integrations)
        instance.template = template
        instance.template_data = template_data
        
        

        instance.save()

        instance.content = validated_data.get('content', instance.content)

        featured_image = validated_data.get('featured_image', False)
        if featured_image != False:
            instance.save_featured_image(featured_image)

        featured_video = validated_data.get('featured_video', False)
        if featured_video != False:
            instance.save_featured_video(featured_video)

        authors = validated_data.get('author_ids')

        if authors:
            instance.save_authors(authors, is_publishable=True)

        if tag_ids != False:
            instance.save_tags(tag_ids)

        topic_id = validated_data.get('topic_id', False)
        if topic_id != False:
            instance.save_topic(topic_id)

        subsection_id = validated_data.get('subsection_id', None)
        instance.save_subsection(subsection_id)

        # Perform a final save (without revision), update content and featured image
        instance.save(
            update_fields=['content', 'featured_image', 'featured_video', 'topic'],
            revision=False)

        return instance

class PageSerializer(DispatchModelSerializer, DispatchPublishableSerializer):
    """Serializes the Page model."""

    id = serializers.ReadOnlyField(source='parent_id')
    slug = serializers.SlugField(validators=[SlugValidator()])

    is_published = NullBooleanField(read_only=True)

    featured_image = ImageAttachmentSerializer(required=False, allow_null=True)
    featured_video = VideoAttachmentSerializer(required=False, allow_null=True)

    content = ContentSerializer()

    url = serializers.CharField(source='get_absolute_url', read_only=True)

    current_version = serializers.IntegerField(
        read_only=True,
        source='revision_id')

    template = TemplateSerializer(required=False, source='get_template')
    template_id = serializers.CharField(required=False, write_only=True)
    template_data = JSONField(required=False)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Page
        fields = (
            'id',
            'slug',
            'url',
            'title',
            'featured_image',
            'featured_video',
            'snippet',
            'content',
            'published_at',
            'updated_at',
            'is_published',
            'published_version',
            'current_version',
            'latest_version',
            'preview_id',
            'template',
            'template_id',
            'template_data',
            'seo_keyword',
            'seo_description'
        )
        authenticated_fields = (
            'template',
            'preview_id'
        )

    def create(self, validated_data):
        instance = Page()
        return self.update(instance, validated_data)

    def update(self, instance, validated_data):

        # Update all the basic fields
        instance.title = validated_data.get('title', instance.title)
        instance.slug = validated_data.get('slug', instance.slug)
        instance.snippet = validated_data.get('snippet', instance.snippet)
        instance.seo_keyword = validated_data.get('seo_keyword', instance.seo_keyword)
        instance.seo_description = validated_data.get('seo_description', instance.seo_description)
        instance.template = validated_data.get('template_id', instance.template)
        instance.template_data = validated_data.get('template_data', instance.template_data)

        # Save instance before processing/saving content in order to save associations to correct ID
        instance.save()

        instance.content = validated_data.get('content', instance.content)

        featured_image = validated_data.get('featured_image', False)
        if featured_image != False:
            instance.save_featured_image(featured_image)

        featured_video = validated_data.get('featured_video', False)
        if featured_video != False:
            instance.save_featured_video(featured_video)

        # Perform a final save (without revision), update content and featured image
        instance.save(
            update_fields=['content', 'featured_image', 'featured_video'],
            revision=False)

        return instance

class IntegrationSerializer(serializers.Serializer):

    id = serializers.CharField(source='ID', read_only=True)
    settings = JSONField(source='get_settings')

    def save(self):

        settings = self.validated_data.get('get_settings')

        if settings:
            self.instance.save(settings)

        return self.instance

class WidgetSerializer(serializers.Serializer):
    id = serializers.SlugField()
    name = serializers.CharField(read_only=True)
    fields = serializers.ListField(read_only=True, child=FieldSerializer())

class ZoneSerializer(serializers.Serializer):
    id = serializers.SlugField(read_only=True)
    name = serializers.CharField(read_only=True)
    widget = PrimaryKeyField(
        allow_null=True,
        serializer=WidgetSerializer(allow_null=True))
    data = JSONField(required=False)

    def validate(self, data):
        """Perform validation of the widget data"""

        from dispatch.theme import ThemeManager

        errors = {}

        if data.get('widget') is not None:

            try:
                widget = ThemeManager.Widgets.get(data['widget'])
            except WidgetNotFound as e:
                errors['widget'] = str(e)
            else:
                for field in widget.fields:

                    field_data = data['data'].get(field.name)

                    if field_data is not None:
                        try:
                            field.validate(field_data)
                        except InvalidField as e:
                            errors[field.name] = str(e)
                    elif field.required:
                        errors[field.name] = '%s is required' % field.label

        if errors:
            raise ValidationError(errors)

        return data

    def update(self, instance, validated_data):

        widget = validated_data.get('widget')

        if not widget:
            instance.delete()
        else:
            instance.save(validated_data)

        return instance

class PollVoteSerializer(DispatchModelSerializer):
    """Serializes the PollVote model"""

    answer_id =  serializers.IntegerField(write_only=True)

    class Meta:

        model = PollVote
        fields = (
            'id',
            'answer_id',
        )

class PollAnswerSerializer(DispatchModelSerializer):
    """Serializes the PollAnswer model"""

    poll_id =  serializers.IntegerField(write_only=True)
    vote_count = serializers.SerializerMethodField()

    class Meta:
        model = PollAnswer
        fields = (
            'id',
            'name',
            'vote_count',
            'poll_id'
        )

    def get_vote_count(self, obj):
        vote_count = 0
        poll = Poll.objects.get(id=obj.poll_id)

        if self.is_authenticated() or poll.show_results:
            vote_count = obj.get_vote_count()

        return vote_count

class PollSerializer(DispatchModelSerializer):
    """Serializes the Poll model."""

    answers = serializers.SerializerMethodField()
    answers_json = JSONField(
        required=False,
        write_only=True
    )
    total_votes = serializers.SerializerMethodField()
    question = serializers.CharField(required=True)
    name = serializers.CharField(required=True)

    class Meta:
        model = Poll
        fields = (
            'id',
            'is_open',
            'show_results',
            'name',
            'question',
            'answers',
            'answers_json',
            'total_votes'
        )

    def get_total_votes(self,obj):
        total_votes = 0

        if self.is_authenticated() or obj.show_results:
            total_votes = obj.get_total_votes()

        return total_votes

    def get_answers(self, obj):
        answers = PollAnswer.objects.filter(poll_id=obj.id)
        serializer = PollAnswerSerializer(answers, many=True, context=self.context)
        return serializer.data

    def create(self, validated_data):
        # Create new ImageGallery instance
        instance = Poll()

        # Then save as usual
        return self.update(instance, validated_data, True)

    def update(self, instance, validated_data, is_new=False):
        # Update all the basic fields
        instance.question = validated_data.get('question', instance.question)
        instance.name = validated_data.get('name', instance.name)
        instance.is_open = validated_data.get('is_open', instance.is_open)
        instance.show_results = validated_data.get('show_results', instance.show_results)
        # Save instance before processing/saving content in order to
        # save associations to correct ID
        instance.save()

        answers = validated_data.get('answers_json')

        if isinstance(answers, list):
            instance.save_answers(answers, is_new)

        return instance

class PodcastSerializer(DispatchModelSerializer):
    """Serializes the Podcast model."""

    id = serializers.UUIDField(read_only=True)
    image = ImageSerializer(read_only=True)
    image_id = serializers.IntegerField(
        write_only=True,
        required=False,
        allow_null=True)
        
    class Meta:
        model = Podcast
        fields = (
            'id',
            'title',
            'slug',
            'description',
            'author',
            'owner_name',
            'owner_email',
            'image',
            'image_id',
            'category'
        )

class PodcastEpisodeSerializer(DispatchModelSerializer):
    """Serializes the PodcastEpisode model."""

    id = serializers.UUIDField(read_only=True)
    image = ImageSerializer(read_only=True)
    image_id = serializers.IntegerField(
        write_only=True,
        required=False,
        allow_null=True)

    podcast_id = serializers.UUIDField()

    if settings.GS_USE_SIGNED_URLS:
        file = serializers.CharField()
        file_upload_url = serializers.CharField(read_only=True)

    file_url = serializers.FileField(source='file', read_only=True, use_url=True)

    class Meta:
        model = PodcastEpisode
        fields = (
            'id',
            'podcast_id',
            'title',
            'description',
            'author',
            'image',
            'image_id',
            'published_at',
            'explicit',
            'file',
            'file_url',
            'duration',
            'type',
        )

        if settings.GS_USE_SIGNED_URLS:
            fields += (
                'file_upload_url',
            )
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueValidator

from dispatch.modules.content.models import (
    Article, Image, ImageAttachment, ImageGallery, Issue,
    File, Page, Author, Section, Tag, Topic, Video)
from dispatch.modules.auth.models import Person, User

from dispatch.api.mixins import DispatchModelSerializer, DispatchPublishableSerializer
from dispatch.api.validators import (
    FilenameValidator, ImageGalleryValidator, PasswordValidator,
    SlugValidator, AuthorValidator)
from dispatch.api.fields import JSONField, PrimaryKeyField, ForeignKeyField

from dispatch.theme.exceptions import WidgetNotFound, InvalidField

class PersonSerializer(DispatchModelSerializer):
    """Serializes the Person model."""

    image = serializers.ImageField(required=False, validators=[FilenameValidator], write_only=True)
    image_url = serializers.CharField(source='get_absolute_image_url', read_only=True)

    class Meta:
        model = Person
        fields = (
            'id',
            'full_name',
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
        write_only=True,
        validators=[PasswordValidator(confirm_field='password_b')]
    )
    password_b = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'person',
            'password_a',
            'password_b',
        )

    def create(self, validated_data):
        instance = User()
        return self.update(instance, validated_data)

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.person = validated_data.get('person', instance.person)

        if validated_data.get('password_a'):
            instance.set_password(validated_data['password_a'])

        instance.save()

        return instance

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
        child=serializers.JSONField(),
        validators=[AuthorValidator])

    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(
        write_only=True,
        required=False,
        child=serializers.IntegerField())

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
        if authors:
            instance.save_authors(authors)

        tag_ids = validated_data.get('tag_ids', False)
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

class ImageAttachmentSerializer(DispatchModelSerializer):
    """Serializes the ImageAttachment model without including full Image instance."""

    image = ImageSerializer(read_only=True)
    image_id =  serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = ImageAttachment
        fields = (
            'image',
            'image_id',
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

class VideoSerializer(DispatchModelSerializer):
    """Serializes the Video model."""
    class Meta:
        model = Video
        fields = (
            'id',
            'title',
            'url',
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
        return map(self.sanitize_block, content)

    def sanitize_block(self, block):
        """Santizes the data for the given block.
        If block has a matching embed serializer, use the `to_internal_value` method"""

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
        for embed_type in self.ids.keys():
            self.load_instances(embed_type, self.ids[embed_type])

    def insert_data(self, content):
        """Insert loaded data into embed data blocks."""
        return map(self.insert_instance, content)

class ArticleSerializer(DispatchModelSerializer, DispatchPublishableSerializer):
    """Serializes the Article model."""

    id = serializers.ReadOnlyField(source='parent_id')
    slug = serializers.SlugField(validators=[SlugValidator()])

    section = SectionSerializer(read_only=True)
    section_id = serializers.IntegerField(write_only=True)

    featured_image = ImageAttachmentSerializer(required=False, allow_null=True)

    content = ContentSerializer()

    authors = AuthorSerializer(many=True, read_only=True)
    author_ids = serializers.ListField(
        write_only=True,
        child=serializers.JSONField(),
        validators=[AuthorValidator])
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

    class Meta:
        model = Article
        fields = (
            'id',
            'slug',
            'url',
            'headline',
            'featured_image',
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
            'published_at',
            'is_published',
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

        # Update basic fields
        instance.headline = validated_data.get('headline', instance.headline)
        instance.section_id = validated_data.get('section_id', instance.section_id)
        instance.slug = validated_data.get('slug', instance.slug)
        instance.snippet = validated_data.get('snippet', instance.snippet)
        instance.reading_time = validated_data.get('reading_time', instance.reading_time)
        instance.importance = validated_data.get('importance', instance.importance)
        instance.seo_keyword = validated_data.get('seo_keyword', instance.seo_keyword)
        instance.seo_description = validated_data.get('seo_description', instance.seo_description)
        instance.integrations = validated_data.get('integrations', instance.integrations)
        instance.template = validated_data.get('template_id', instance.template)
        instance.template_data = validated_data.get('template_data', instance.template_data)

        # Save instance before processing/saving content in order to save associations to correct ID
        instance.save()

        instance.content = validated_data.get('content', instance.content)

        featured_image = validated_data.get('featured_image', False)
        if featured_image != False:
            instance.save_featured_image(featured_image)

        authors = validated_data.get('author_ids')
        if authors:
            instance.save_authors(authors, is_publishable=True)

        tag_ids = validated_data.get('tag_ids', False)
        if tag_ids != False:
            instance.save_tags(tag_ids)

        topic_id = validated_data.get('topic_id', False)
        if topic_id != False:
            instance.save_topic(topic_id)

        # Perform a final save (without revision), update content and featured image
        instance.save(
            update_fields=['content', 'featured_image', 'topic'],
            revision=False)

        return instance

class PageSerializer(DispatchModelSerializer, DispatchPublishableSerializer):
    """Serializes the Page model."""

    id = serializers.ReadOnlyField(source='parent_id')
    slug = serializers.SlugField(validators=[SlugValidator()])

    featured_image = ImageAttachmentSerializer(required=False, allow_null=True)

    content = ContentSerializer()

    url = serializers.CharField(source='get_absolute_url', read_only=True)

    current_version = serializers.IntegerField(
        read_only=True,
        source='revision_id')

    template = TemplateSerializer(required=False, source='get_template')
    template_id = serializers.CharField(required=False, write_only=True)
    template_data = JSONField(required=False)

    class Meta:
        model = Page
        fields = (
            'id',
            'slug',
            'url',
            'title',
            'featured_image',
            'snippet',
            'content',
            'published_at',
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

        # Perform a final save (without revision), update content and featured image
        instance.save(
            update_fields=['content', 'featured_image'],
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

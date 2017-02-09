from rest_framework import serializers

from dispatch.apps.content.models import Article, Page, Section, Comment, Tag, Topic, Image, ImageAttachment, ImageGallery
from dispatch.apps.core.models import User, Person
from dispatch.apps.core.actions import perform_action
from dispatch.apps.api.fields import JSONField


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email'
        )

class PersonSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the Person model.
    """
    class Meta:
        model = Person
        fields = (
            'id',
            'full_name',
        )

class ImageSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the Image model.
    """
    title = serializers.CharField(allow_null=True, allow_blank=True, trim_whitespace=False)
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    thumb = serializers.CharField(source='get_thumbnail_url', read_only=True)
    authors = PersonSerializer(many=True, read_only=True)
    filename = serializers.CharField(read_only=True)
    width = serializers.IntegerField()
    height = serializers.IntegerField()

    author_ids = serializers.ListField(write_only=True, child=serializers.IntegerField())

    class Meta:
        model = Image
        fields = (
            'id',
            'filename',
            'title',
            'authors',
            'author_ids',
            'url',
            'thumb',
            'created_at',
            'width',
            'height'
        )

    def update(self, instance, validated_data):

        # Save properties
        instance.title = validated_data.get('title', instance.title)
        instance.save()

        # Save relationships
        author_ids = validated_data.get('author_ids', None)
        if author_ids is not None:
            instance.save_authors(author_ids)

        return instance

class TagSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the Tag model.
    """
    class Meta:
        model = Tag
        fields = (
            'id',
            'name',
        )

class TopicSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the Topic model.
    """
    class Meta:
        model = Topic
        fields = (
            'id',
            'name',
        )

class ImageAttachmentSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the ImageAttachment model without including full Image instance.
    """
    image = ImageSerializer()

    class Meta:
        model = ImageAttachment
        fields = (
            'image',
            'caption',
            'credit'
        )

class ImageGallerySerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the ImageGallery model without including full Image instance.
    """

    images = ImageAttachmentSerializer(read_only=True, many=True)
    attachment_json = JSONField(required=False, write_only=True)

    class Meta:
        model = ImageGallery
        fields = (
            'id',
            'title',
            'images',
            'attachment_json'
        )

    def create(self, validated_data):

        # Create new ImageGallery instance!
        instance = ImageGallery()

        # Then save as usual
        return self.update(instance, validated_data)

    def update(self, instance, validated_data):

        # Update all the basic fields
        instance.title = validated_data.get('title', instance.title)

        # Save instance before processing/saving content in order to save associations to correct ID
        instance.save()

        attachment_json = validated_data.get('attachment_json', False)

        if isinstance(attachment_json, list):
            instance.save_attachments(attachment_json)

        return instance

class SectionSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the Section model.
    """
    class Meta:
        model = Section
        fields = (
            'id',
            'name',
            'slug',
        )

class CommentSerializer(serializers.HyperlinkedModelSerializer):

    article_id = serializers.IntegerField(write_only=True)
    user = serializers.CharField(read_only=True, source='user.person.full_name')
    timestamp = serializers.DateTimeField(format='%B %d, %Y', source='created_at', read_only=True)

    class Meta:
        model = Comment
        fields = (
            'user',
            'article_id',
            'content',
            'timestamp',
            'votes'
        )

    def create(self, validated_data):

        user = validated_data.get('user', None)

        if user is not None:
            instance = Comment(user=user)
            return self.update(instance, validated_data)
        else:
            return False

    def update(self, instance, validated_data):

        # Update all the fields
        instance.article_id = validated_data.get('article_id', instance.article_id)
        instance.content = validated_data.get('content', instance.content)

        instance.save()

        return instance

class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the Article model.
    """
    section = SectionSerializer(read_only=True)
    section_id = serializers.IntegerField(write_only=True)

    featured_image = ImageAttachmentSerializer(read_only=True)
    featured_image_json = JSONField(required=False, allow_null=True, write_only=True)

    content = serializers.ReadOnlyField(source='get_json')
    content_json = serializers.CharField(write_only=True)

    authors = PersonSerializer(many=True, read_only=True)
    author_ids = serializers.ListField(write_only=True, child=serializers.IntegerField())
    authors_string = serializers.CharField(source='get_author_string',read_only=True)

    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(write_only=True, required=False, child=serializers.IntegerField())

    topic = TopicSerializer(read_only=True)
    topic_id = serializers.IntegerField(write_only=True, allow_null=True, required=False)

    url = serializers.CharField(source='get_absolute_url',read_only=True)
    id = serializers.ReadOnlyField(source='parent.id')

    published_version = serializers.IntegerField(read_only=True, source='get_published_version')
    current_version = serializers.IntegerField(read_only=True, source='revision_id')
    latest_version = serializers.IntegerField(read_only=True, source='get_latest_version')

    template = JSONField(required=False, source='get_template')
    template_id = serializers.CharField(required=False, write_only=True)
    template_fields = JSONField(required=False, source='get_template_fields')

    class Meta:
        model = Article
        fields = (
            'id',
            'headline',
            'featured_image',
            'featured_image_json',
            'snippet',
            'content',
            'content_json',
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
            'importance',
            'reading_time',
            'slug',
            'url',
            'status',
            'template',
            'template_id',
            'template_fields',
            'seo_keyword',
            'seo_description',
            'est_reading_time'
        )

    def create(self, validated_data):

        # Create new Article instance!
        instance = Article()

        # Then save as usual
        return self.update(instance, validated_data, action='create')

    def update(self, instance, validated_data, action='update'):

        status = validated_data.get('status', instance.status)

        if status != instance.status and status == Article.PUBLISHED:
            action = 'publish'

        # Update all the basic fields
        instance.headline = validated_data.get('headline', instance.headline)
        instance.section_id = validated_data.get('section_id', instance.section_id)
        instance.slug = validated_data.get('slug', instance.slug)
        instance.snippet = validated_data.get('snippet', instance.snippet)
        instance.template = validated_data.get('template_id', instance.template)
        instance.status = status
        instance.reading_time = validated_data.get('reading_time', instance.reading_time)
        instance.importance = validated_data.get('importance', instance.importance)
        instance.seo_keyword = validated_data.get('seo_keyword', instance.seo_keyword)
        instance.seo_description = validated_data.get('seo_description', instance.seo_description)

        # Save instance before processing/saving content in order to save associations to correct ID
        instance.save()

        instance.content = validated_data.get('content_json', instance.content)

        instance.est_reading_time = instance.calc_est_reading_time()

        # Process article attachments
        instance.save_attachments()

        # Save template fields
        template_fields = validated_data.get('get_template_fields', False)
        if template_fields:
            instance.save_template_fields(template_fields)

        # If there's a featured image, save it
        featured_image = validated_data.get('featured_image_json', False)
        if featured_image:
            instance.save_featured_image(featured_image)

        # If there are authors, save them
        authors = validated_data.get('author_ids', False)
        if authors:
            instance.save_authors(authors)

        # If there are tags, save them
        tag_ids = validated_data.get('tag_ids', False)
        if tag_ids != False:
            instance.save_tags(tag_ids)

        # If there is a topic, save it
        topic_id = validated_data.get('topic_id', False)

        if topic_id != False:
            instance.save_topic(topic_id)

        # Perform a final save (without revision), update content and featured image
        instance.save(update_fields=['content', 'featured_image', 'topic', 'est_reading_time'], revision=False)

        if instance.parent:
            perform_action(self.context['request'].user.person, action, 'article', instance.parent.id)
        else:
            perform_action(self.context['request'].user.person, action, 'article', instance.pk)

        return instance

class PageSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the Page model.
    """

    featured_image = ImageAttachmentSerializer(read_only=True)
    featured_image_json = JSONField(required=False, write_only=True)

    content = serializers.ReadOnlyField(source='get_json')
    content_json = serializers.CharField(write_only=True)

    url = serializers.CharField(source='get_absolute_url',read_only=True)
    parent = serializers.ReadOnlyField(source='parent.id')

    published_version = serializers.IntegerField(read_only=True, source='get_published_version')

    template_fields = JSONField(required=False, source='get_template_fields')

    class Meta:
        model = Page
        fields = (
            'id',
            'parent',
            'title',
            'featured_image',
            'featured_image_json',
            'snippet',
            'content',
            'content_json',
            'published_at',
            'is_published',
            'published_version',
            'slug',
            'revision_id',
            'url',
            'status',
            'template',
            'template_fields',
            'seo_keyword',
            'seo_description'
        )

    def __init__(self, *args, **kwargs):
        # Instantiate the superclass normally
        super(PageSerializer, self).__init__(*args, **kwargs)

        template_fields = self.context['request'].query_params.get('template_fields', False)

        if self.context['request'].method == 'GET' and not template_fields:
            self.fields.pop('template_fields')

    def create(self, validated_data):

        # Create new Article instance!
        instance = Page()

        # Then save as usual
        return self.update(instance, validated_data, action='create')

    def update(self, instance, validated_data, action='update'):

        status = validated_data.get('status', instance.status)

        if status != instance.status and status == Article.PUBLISHED:
            action = 'publish'

        # Update all the basic fields
        instance.title = validated_data.get('title', instance.title)
        instance.slug = validated_data.get('slug', instance.slug)
        instance.snippet = validated_data.get('snippet', instance.snippet)
        instance.template = validated_data.get('template', instance.template)
        instance.status = status
        instance.seo_keyword = validated_data.get('seo_keyword', instance.seo_keyword)
        instance.seo_description = validated_data.get('seo_description', instance.seo_description)

        # Save instance before processing/saving content in order to save associations to correct ID
        instance.save()

        instance.content = validated_data.get('content_json', instance.content)

        # Process article attachments
        instance.save_attachments()

        # Save template fields
        template_fields = validated_data.get('get_template_fields', False)
        if template_fields:
            instance.save_template_fields(template_fields)

        # If there's a featured image, save it
        featured_image = validated_data.get('featured_image_json', False)
        if featured_image:
            instance.save_featured_image(featured_image)

        # Perform a final save (without revision), update content and featured image
        instance.save(update_fields=['content', 'featured_image'], revision=False)

        if instance.parent:
            perform_action(self.context['request'].user.person, action, 'page', instance.parent.id)
        else:
            perform_action(self.context['request'].user.person, action, 'page', instance.pk)

        return instance

class IntegrationSerializer(serializers.Serializer):

    id = serializers.CharField(source='ID', read_only=True)
    settings = serializers.JSONField(source='get_settings')

    def save(self):

        settings = self.validated_data.get('get_settings', None)

        if settings:
            self.instance.save(settings)

        return self.instance

from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

from rest_framework import serializers

from dispatch.apps.content.models import Author, Article, Section, Tag, Image, ImageAttachment, ImageGallery
from dispatch.apps.core.models import Person
from dispatch.apps.api.fields import JSONField


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
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    thumb = serializers.CharField(source='get_thumbnail_url', read_only=True)
    authors = PersonSerializer(many=True, read_only=True)
    filename = serializers.CharField(read_only=True)

    class Meta:
        model = Image
        fields = (
            'id',
            'img',
            'filename',
            'title',
            'authors',
            'url',
            'thumb',
            'created_at',
        )
        write_only_fields = (
            'img',
        )


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

class ImageAttachmentSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the ImageAttachment model without including full Image instance.
    """
    id = serializers.IntegerField(source='image.id')
    attachment_id = serializers.IntegerField(source='id', read_only=True)
    url = serializers.CharField(source='image.get_absolute_url', read_only=True)
    credit = serializers.CharField(source='get_credit')
    width = serializers.IntegerField(source='image.width')
    height = serializers.IntegerField(source='image.height')

    class Meta:
        model = ImageAttachment
        fields = (
            'id',
            'attachment_id',
            'url',
            'caption',
            'credit',
            'type',
            'width',
            'height'
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

class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the Article model.
    """
    section = SectionSerializer(read_only=True)
    section_id = serializers.IntegerField(write_only=True)

    featured_image = ImageAttachmentSerializer(read_only=True)
    featured_image_json = JSONField(required=False, write_only=True)

    content = serializers.ReadOnlyField(source='get_json')
    content_json = serializers.CharField(write_only=True)

    authors = PersonSerializer(many=True)
    author_ids = serializers.CharField(write_only=True)
    authors_string = serializers.CharField(source='get_author_string',read_only=True)

    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.CharField(write_only=True, required=False, allow_blank=True)

    url = serializers.CharField(source='get_absolute_url',read_only=True)
    parent = serializers.ReadOnlyField(source='parent.id')

    template_fields = JSONField(required=False, source='get_template_fields')

    class Meta:
        model = Article
        fields = (
            'id',
            'parent',
            'long_headline',
            'short_headline',
            'featured_image',
            'featured_image_json',
            'snippet',
            'content',
            'content_json',
            'authors',
            'author_ids',
            'tags',
            'tag_ids',
            'authors_string',
            'section',
            'section_id',
            'published_at',
            'importance',
            'reading_time',
            'slug',
            'revision_id',
            'url',
            'status',
            'template',
            'template_fields'
        )

    def __init__(self, *args, **kwargs):
        # Instantiate the superclass normally
        super(ArticleSerializer, self).__init__(*args, **kwargs)

        template_fields = self.context['request'].QUERY_PARAMS.get('template_fields', False)

        if self.context['request'].method == 'GET' and not template_fields:
            self.fields.pop('template_fields')

    def create(self, validated_data):

        # Create new Article instance!
        instance = Article()

        # Then save as usual
        return self.update(instance, validated_data)

    def update(self, instance, validated_data):

        # Update all the basic fields
        instance.long_headline = validated_data.get('long_headline', instance.long_headline)
        instance.short_headline = validated_data.get('short_headline', instance.short_headline)
        instance.section_id = validated_data.get('section_id', instance.section_id)
        instance.slug = validated_data.get('slug', instance.slug)
        instance.snippet = validated_data.get('snippet', instance.snippet)
        instance.template = validated_data.get('template', instance.template)
        instance.status = validated_data.get('status', instance.status)
        instance.reading_time = validated_data.get('reading_time', instance.reading_time)
        instance.importance = validated_data.get('importance', instance.importance)

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

        # If there are authors, save them
        authors = validated_data.get('author_ids', False)
        if authors:
            instance.save_authors(authors)

        # If there are tags, save them
        tags = validated_data.get('tag_ids', False)
        if tags:
            instance.save_tags(tags)

        # Perform a final save (without revision), update content and featured image
        instance.save(update_fields=['content', 'featured_image'], revision=False)

        return instance
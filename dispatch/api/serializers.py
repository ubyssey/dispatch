from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

from rest_framework import serializers

from dispatch.apps.content.models import (Resource, Author, Article, Section,
                                          Tag, Image, ImageAttachment)
from dispatch.apps.core.models import Person

class PersonSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the Person model.
    """
    class Meta:
        model = Person
        fields = (
            'id',
            'full_name',
            'first_name',
            'last_name'
        )

class ImageSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the Image model.

    Special fields:
    url         mapped to Image.get_absolute_url
    thumb       mapped to Image.get_thumbnail_url
    authors     returns serialized Author list using PersonSerializer
    filename    read only field
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
            'name',
        )

class ImageAttachmentSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the ImageAttachment model without including full Image instance.
    This serializer is used for creating new associations between Articles
    and Images when the Image already exists.

    Special fields:
    article     returns the ID of related Article instance
    image       returns the ID of related Image instance
    """
    article = serializers.PrimaryKeyRelatedField(queryset=Article.objects.all())
    image = serializers.PrimaryKeyRelatedField(queryset=Image.objects.all())

    class Meta:
        model = ImageAttachment
        fields = (
            'id',
            'article',
            'image',
            'caption'
        )

class FullImageAttachmentSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the ImageAttachment model, including full Image instance.

    Special fields:
    image       returns serialized Image instance using ImageSerializer
    """
    image = ImageSerializer(read_only=True)

    class Meta:
        model = ImageAttachment
        fields = (
            'id',
            'image',
            'caption',
            'type'
        )

class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializes the Article model.

    Special fields:
    section             mapped to Section.slug
    featured_image      returns serialized Image instance using FullImageAttachmentSerializer
    authors             returns serialized Author list using PersonSerializer
    content             mapped to Article.get_json()
    authors_string      mapped to Article.get_author_string()
    url                 mapped to Article.get_absolute_url()
    parent              mapped to Parent.id
    """
    section = serializers.CharField(source='section.slug',read_only=True)
    featured_image = FullImageAttachmentSerializer(read_only=True)
    authors = PersonSerializer(many=True, read_only=True)
    content = serializers.ReadOnlyField(source='get_json')
    authors_string = serializers.CharField(source='get_author_string',read_only=True)
    url = serializers.CharField(source='get_absolute_url',read_only=True)
    parent = serializers.ReadOnlyField(source='parent.id')

    class Meta:
        model = Article
        fields = (
            'id',
            'parent',
            'long_headline',
            'short_headline',
            'featured_image',
            'content',
            'authors',
            'authors_string',
            'section',
            'published_at',
            'importance',
            'slug',
            'revision_id',
            'url',
        )

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
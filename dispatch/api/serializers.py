__author__ = "Steven Richards doesn't do anything"
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from dispatch.apps.content.models import Resource, Author, Article, Section, Tag, Image, ImageAttachment
from dispatch.apps.core.models import Person
from rest_framework import serializers

class PersonSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Person
        fields = ('id','full_name','first_name','last_name')

class ImageSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    thumb = serializers.CharField(source='get_thumbnail_url', read_only=True)
    authors = PersonSerializer(many=True, read_only=True)
    filename = serializers.CharField(read_only=True)

    class Meta:
        model = Image
        fields = ('id', 'img', 'filename', 'title', 'authors', 'url', 'thumb', 'created_at',)
        write_only_fields = ('img',)

class CommentSerializer(serializers.Serializer):
    email = serializers.EmailField()
    content = serializers.CharField(max_length=200)
    created = serializers.DateTimeField()

    def create(self, validated_data):
        return Comment(**validated_data)

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.content = validated_data.get('content', instance.content)
        instance.created = validated_data.get('created', instance.created)
        return instance

class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ('name',)

class AttachmentSerializer(serializers.HyperlinkedModelSerializer):
    article = serializers.PrimaryKeyRelatedField(queryset=Article.objects.all(), required=False)
    image = serializers.PrimaryKeyRelatedField(queryset=Image.objects.all())

    class Meta:
        model = ImageAttachment
        fields = ('id', 'article', 'image', 'caption')

class AttachmentImageSerializer(serializers.HyperlinkedModelSerializer):
    image = ImageSerializer(read_only=True)

    class Meta:
        model = ImageAttachment
        fields = ('id', 'image', 'caption', 'type')

class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    section = serializers.CharField(source='section.slug',read_only=True)
    featured_image = AttachmentImageSerializer(read_only=True)
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

    class Meta:
        model = Section
        fields = (
            'id',
            'name',
            'slug',
        )

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('url', 'email')
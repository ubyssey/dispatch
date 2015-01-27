__author__ = 'Steven Richards'
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from dispatch.apps.content.models import Article, Tag, Image, Attachment
from dispatch.apps.core.models import Person
from rest_framework import serializers

class ImageSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    thumb = serializers.CharField(source='get_thumbnail_url', read_only=True)

    class Meta:
        model = Image
        fields = ('id', 'img', 'url', 'thumb', 'created_at')

class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ('name',)

class AttachmentSerializer(serializers.HyperlinkedModelSerializer):
    article = serializers.PrimaryKeyRelatedField(queryset=Article.objects.all())
    image = serializers.PrimaryKeyRelatedField(queryset=Image.objects.all())

    class Meta:
        model = Attachment
        fields = ('id', 'article', 'image', 'caption')


class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Article
        fields = ('long_headline',
                  'short_headline',
                  'section',
                  'is_published',
                  'published_at',
                  'slug',
                  'content')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('url', 'email')

class PersonSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Person
        fields = ('first_name','last_name','user','roles')
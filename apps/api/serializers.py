__author__ = 'Steven Richards'
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from dispatch.apps.content.models import Resource, Article
from rest_framework import serializers

class ResourceSerializer(serializers.HyperlinkedModelSerializer):
   class Meta:
        model = Resource
        fields = ('created_at','updated_at')

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

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')
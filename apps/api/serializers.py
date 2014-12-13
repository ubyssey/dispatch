__author__ = 'Steven Richards'
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from dispatch.apps.content.models import Resource, Article
from rest_framework import serializers

class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Article
        fields = ('long_headline',
                  'short_headline',
                  'section',
                  'author',
                  'is_published',
                  'published_at',
                  'slug',
                  'content')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('url', 'email')

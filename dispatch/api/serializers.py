__author__ = 'Steven Richards'
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from rest_framework import serializers

#class ArticleSerializer(serializers.HyperlinkedModelSerializer):
#   class Meta:
#        model = Article
#        fields = ('headline')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    model = get_user_model()
    class Meta:
        fields = ('url', 'username', 'email', 'groups')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    model = Group
    class Meta:
        fields = ('url', 'name')
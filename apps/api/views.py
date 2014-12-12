__author__ = 'Steven Richards'
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from dispatch.apps.content.models import Resource, Article
from rest_framework import viewsets

from dispatch.apps.api.serializers import UserSerializer, GroupSerializer, ArticleSerializer, ResourceSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    User = get_user_model()
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class ResourceSerializer(viewsets.ModelViewSet):
    queryset = Resource.object.all()
    serializer_class = ResourceSerializer

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
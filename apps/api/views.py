__author__ = 'Steven Richards'
from django.contrib.auth import get_user_model
from dispatch.apps.content.models import Resource, Article
from dispatch.apps.core.models import Person
from rest_framework import viewsets
from dispatch.apps.api.serializers import UserSerializer, GroupSerializer, ArticleSerializer, ResourceSerializer, PersonSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    User = get_user_model()
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person
    serializer_class = PersonSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.object.all()
    serializer_class = ResourceSerializer

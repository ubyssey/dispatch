__author__ = 'Steven Richards'
from django.contrib.auth import get_user_model
from dispatch.apps.content.models import Article, Tag, Image, Attachment
from dispatch.apps.core.models import Person
from rest_framework import viewsets
from dispatch.apps.api.serializers import UserSerializer, ArticleSerializer, ImageSerializer, AttachmentSerializer, TagSerializer, PersonSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    User = get_user_model()
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class AttachmentViewSet(viewsets.ModelViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer

class ImageViewSet(viewsets.ModelViewSet):
    model = Image
    serializer_class = ImageSerializer

    def get_queryset(self):
        queryset = Image.objects.all()
        q = self.request.QUERY_PARAMS.get('q', None)
        if q is not None:
            queryset = queryset.filter(caption__icontains=q)
        return queryset
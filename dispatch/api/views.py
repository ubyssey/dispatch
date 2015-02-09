__author__ = 'Steven Richards'
from django.contrib.auth import get_user_model
from dispatch.apps.content.models import Article, Tag, Image, Attachment, ImageAttachment
from dispatch.apps.core.models import Person
from rest_framework import viewsets, filters
from dispatch.apps.api.serializers import UserSerializer, ArticleSerializer, ImageSerializer, AttachmentSerializer, AttachmentImageSerializer, TagSerializer, PersonSerializer
from django.db.models import Q

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

    def get_queryset(self):
        queryset = Person.objects.all()
        q = self.request.QUERY_PARAMS.get('q', None)
        queryset = queryset.filter(full_name__icontains=q)
        return queryset

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class AttachmentImageViewSet(viewsets.ModelViewSet):
    model = ImageAttachment
    serializer_class = AttachmentImageSerializer
    paginate_by = 100

    def get_queryset(self):
        queryset = ImageAttachment.objects.all()
        article = self.request.QUERY_PARAMS.get('article', None)
        if article is not None:
            queryset = queryset.filter(article__id=article)
        return queryset

class AttachmentViewSet(viewsets.ModelViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer

class ImageViewSet(viewsets.ModelViewSet):
    model = Image
    serializer_class = ImageSerializer
    paginate_by = 30
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('created_at')

    def get_queryset(self):
        queryset = Image.objects.all()
        q = self.request.QUERY_PARAMS.get('q', None)
        if q is not None:
            queryset = queryset.filter(caption__icontains=q)
        return queryset
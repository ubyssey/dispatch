__author__ = 'Steven Richards'
from django.contrib.auth import get_user_model
from dispatch.apps.content.models import Article, Tag, Image, ImageAttachment
from dispatch.apps.core.models import Person
from rest_framework import viewsets, filters, status
from rest_framework.response import Response
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
    queryset = Article.objects.filter(head=True).order_by('-importance')
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
        article = self.request.QUERY_PARAMS.get('resource', None)
        if article is not None:
            queryset = queryset.filter(article__id=article)
        return queryset

class AttachmentViewSet(viewsets.ModelViewSet):
    queryset = ImageAttachment.objects.all()
    serializer_class = AttachmentSerializer

class ImageViewSet(viewsets.ModelViewSet):
    model = Image
    serializer_class = ImageSerializer
    paginate_by = 30
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('created_at')

    def create(self, request, *args, **kwargs):
        # set author to current user if no authors are passed
        authors = request.POST.get('authors', False)
        if not authors:
            authors = [request.user.id]
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        resource = serializer.save()
        resource.save_authors(authors) # handle author saving
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):

        authors = request.data.get('authors', False)

        partial = kwargs.pop('partial', False)

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        resource = serializer.save()

        if authors:
            print "saving authors"
            print authors
            resource.save_authors(authors)

        return Response(serializer.data)

    def get_queryset(self):
        queryset = Image.objects.all()
        q = self.request.QUERY_PARAMS.get('q', None)
        if q is not None:
            queryset = queryset.filter(Q(title__icontains=q) | Q(img__icontains=q) )
        return queryset
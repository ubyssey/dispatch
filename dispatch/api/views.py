__author__ = 'Steven Richards'
from django.contrib.auth import get_user_model
from dispatch.apps.content.models import Article, Section, Tag, Image, ImageAttachment
from dispatch.apps.core.models import Person
from rest_framework import viewsets, generics, mixins, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import detail_route, list_route
from dispatch.apps.api.serializers import UserSerializer, ArticleSerializer, SectionSerializer, ImageSerializer, AttachmentSerializer, AttachmentImageSerializer, TagSerializer, PersonSerializer
from django.db.models import Q

class FrontpageViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    serializer_class = ArticleSerializer

    def fetch_frontpage(self, section_id=None, section_slug=None):
        """
        Return serialized frontpage listing, optionally filtered by section.
        """
        if section_id is not None:
            queryset = Article.objects.get_frontpage(section_id=int(section_id))
        elif section_slug is not None:
            queryset = Article.objects.get_frontpage(section=section_slug)
        else:
            queryset = Article.objects.get_frontpage()

        # Cast RawQuerySet as list for pagination to work
        return list(queryset)

    def list(self, request):
        """
        Return resource listing representing the most recent and
        relevant articles, photos, and videos for the given timestamp.

        TODO: implement timestamp parameter
        """
        self.queryset = self.fetch_frontpage()
        return super(FrontpageViewSet, self).list(self, request)

    def section(self, request, pk=None, slug=None):
        """
        Return resource listing representing the most recent and
        relevant articles, photos, and videos in the given section
        for the given timestamp.

        TODO: implement timestamp parameter
        """
        self.queryset = self.fetch_frontpage(section_id=pk, section_slug=slug)
        return super(FrontpageViewSet, self).list(self, request)

class SectionViewSet(viewsets.ModelViewSet):
    serializer_class = SectionSerializer

    queryset = Section.objects.all()

    def frontpage(self, request, pk=None, slug=None):
        view = FrontpageViewSet.as_view({'get': 'section'})
        return view(request, pk=pk, slug=slug)

class ImageAttachmentViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    model = ImageAttachment
    serializer_class = AttachmentImageSerializer
    paginate_by = 50
    queryset = ImageAttachment.objects.all()

    def article(self, request, pk=None):
        if pk is not None:
            self.queryset = self.queryset.filter(article__id=pk)
        return super(ImageAttachmentViewSet, self).list(self, request)

class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned articles by filtering
        against a `topic` query parameter in the URL.
        """
        queryset = Article.objects.filter(head=True).order_by('-published_at')
        topic = self.request.QUERY_PARAMS.get('topic', None)
        if topic is not None:
            queryset = queryset.filter(topics__name=topic)
        return queryset

    @detail_route(methods=['get'],)
    def attachments(self, request, pk=None):
        """
        Returns a list of the aricle's attachments.
        """
        view = ImageAttachmentViewSet.as_view({'get': 'article'})
        return view(request, pk)

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    User = get_user_model()
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PersonViewSet(viewsets.ModelViewSet):
    serializer_class = PersonSerializer

    def get_queryset(self):
        queryset = Person.objects.all()
        q = self.request.QUERY_PARAMS.get('q', None)
        if q is not None:
            queryset = queryset.filter(full_name__icontains=q)
        return queryset



class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

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

@api_view(['GET', 'POST'])
def component_view(request, slug=None):
    components = ThemeHelper.get_theme_components()
    if request.method == 'POST':
        post_data = request.POST
        try:
            instance = Page.objects.get(slug=slug)
        except:
            instance = Page(slug=slug)
            instance.save()

        component_slug = post_data.get('component')
        spot = post_data.get('spot')

        component_class = components.get(component_slug)

        try:
            component_instance = Component.objects.get(page=instance, spot=spot)
            if component_instance.slug == component_slug:
                component_obj = component_class(post_data, instance=component_instance, spot=spot)
            else:
                instance.components.remove(instance)
                raise Exception()
        except:
            component_obj = component_class(post_data, spot=spot)

        component_instance = component_obj.save()

        instance.components.add(component_instance)

        instance.save()

        for c in instance.components.all():
            print c.slug

        data = {
            'saved': True,
        }

    else:
        pages = ThemeHelper.get_theme_pages()
        page = pages.get(slug)

        spots_list = []
        components_dict = {}

        for spot, name in page.component_spots:
            options = []
            for component in components.get_for_spot(spot):
                options.append({
                    'name': component.NAME,
                    'slug': component.SLUG,
                    })
                if component.SLUG not in components_dict:
                    component_obj = component()
                    components_dict[component.SLUG] = component_obj.fields_as_json()
            spots_list.append({
                'name': name,
                'slug': spot,
                'options': options,
            })

        data = {
            'spots': spots_list,
            'components': components_dict,
        }

    return Response(data)
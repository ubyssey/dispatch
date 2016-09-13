from django.template.loader import render_to_string
from django.db.models import Q

from rest_framework import viewsets, mixins, filters, status
from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework.generics import get_object_or_404
from rest_framework.exceptions import APIException

from dispatch.helpers.theme import ThemeHelper
from dispatch.apps.core.models import Person
from dispatch.apps.frontend.models import ComponentSet, Component
from dispatch.apps.content.models import Article, Page, Section, Comment, Tag, Topic, Image, ImageAttachment, ImageGallery
from dispatch.apps.api.serializers import (ArticleSerializer, PageSerializer, SectionSerializer, ImageSerializer, CommentSerializer,
                                           ImageGallerySerializer, TagSerializer, TopicSerializer, PersonSerializer)

class SectionViewSet(viewsets.ModelViewSet):
    """
    Viewset for Section model views.
    """
    serializer_class = SectionSerializer

    queryset = Section.objects.all()

class ArticleViewSet(viewsets.ModelViewSet):
    """
    Viewset for Article model views.
    """
    serializer_class = ArticleSerializer
    lookup_field = 'parent_id'

    def get_queryset(self):
        """
        Optionally restricts the returned articles by filtering
        against a `topic` query parameter in the URL.
        """

        if self.request.user.is_authenticated():
            queryset = Article.objects.filter(head=True)
        else:
            queryset = Article.objects.filter(head=True, is_published=True)

        queryset = queryset.order_by('-published_at')

        tag = self.request.query_params.get('tag', None)
        q = self.request.query_params.get('q', None)
        section = self.request.query_params.get('section', None)
        topic = self.request.query_params.get('topic', None)

        if tag is not None:
            queryset = queryset.filter(tags__name=tag)
        if q is not None:
            queryset = queryset.filter(headline__icontains=q)
        if section is not None:
            queryset = queryset.filter(section_id=section)
        if topic is not None:
            queryset = queryset.filter(topic_id=topic)

        return queryset


    def list(self, request, *args, **kwargs):

        queryset = self.filter_queryset(self.get_queryset())

        drafts = self.request.query_params.get('drafts', False)

        if not drafts:
            queryset = queryset.filter(is_published=True)

        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @detail_route(methods=['get'],)
    def publish(self, request, parent_id=None):
        queryset = Article.objects.all()
        instance = get_object_or_404(queryset, pk=parent_id)

        instance.publish()

        serializer = self.get_serializer(instance)

        return Response(serializer.data)

    @detail_route(methods=['get'],)
    def unpublish(self, request, parent_id=None):
        queryset = Article.objects.all()
        instance = get_object_or_404(queryset, pk=parent_id)

        instance.unpublish()

        serializer = self.get_serializer(instance)

        return Response(serializer.data)

    @detail_route(methods=['get'],)
    def revision(self, request, parent_id=None):
        revision_id = request.query_params.get('revision_id', None)
        filter_kwargs = {
            'parent_id': parent_id,
            'revision_id': revision_id,
        }
        queryset = Article.objects.all()
        instance = get_object_or_404(queryset, **filter_kwargs)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def topic(self, request, pk=None):
        queryset = Article.objects.filter(topic_id=pk, status=Article.PUBLISHED).order_by('-published_at')

        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @detail_route(methods=['get'],)
    def rendered(self, request, parent_id=None):

        article = Article.objects.get(parent_id=parent_id, head=True)

        context = {
            'article': article,
            'base_template': 'blank.html',
        }

        data = {
            'id': article.parent_id,
            'headline': article.headline,
            'url': article.get_absolute_url(),
            'html': render_to_string(article.get_template(), context)
        }

        return Response(data)

    def bulk_delete(self, request):
        deleted = []
        ids = self.request.data.get('ids', None)
        print ids
        if ids is not None:
            ids = ids.split(',')
            for id in ids:
                try:
                    Article.objects.filter(parent_id=id).delete()
                    deleted.append(id)
                except:
                    pass

        data = {
            'deleted': deleted
        }

        return Response(data)

class PageViewSet(viewsets.ModelViewSet):
    """
    Viewset for Page model views.
    """
    serializer_class = PageSerializer
    lookup_field = 'parent_id'

    def get_queryset(self):
        """
        Optionally restricts the returned articles by filtering
        against a `topic` query parameter in the URL.
        """

        if self.request.user.is_authenticated():
            queryset = Page.objects.filter(head=True)
        else:
            queryset = Page.objects.filter(head=True, status=Page.PUBLISHED)

        queryset = queryset.order_by('-published_at')

        q = self.request.query_params.get('q', None)

        if q is not None:
            queryset = queryset.filter(headline__icontains=q)

        return queryset

    @detail_route(methods=['get'],)
    def publish(self, request, parent_id=None):
        queryset = Page.objects.all()
        instance = get_object_or_404(queryset, pk=parent_id)

        instance.publish()

        serializer = self.get_serializer(instance)

        return Response(serializer.data)

    @detail_route(methods=['get'],)
    def unpublish(self, request, parent_id=None):
        queryset = Page.objects.all()
        instance = get_object_or_404(queryset, pk=parent_id)

        instance.unpublish()

        serializer = self.get_serializer(instance)

        return Response(serializer.data)

    @detail_route(methods=['get'],)
    def revision(self, request, parent_id=None):
        revision_id = request.query_params.get('revision_id', None)
        filter_kwargs = {
            'parent_id': parent_id,
            'revision_id': revision_id,
        }
        queryset = Page.objects.all()
        instance = get_object_or_404(queryset, **filter_kwargs)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class CommentViewSet(viewsets.ModelViewSet):

    serializer_class = CommentSerializer
    queryset = Comment.objects.order_by('-created_at')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def article(self, request, pk=None):
        self.queryset = Comment.objects.filter(article_id=pk).order_by('-created_at')
        return self.list(request)



class PersonViewSet(viewsets.ModelViewSet):
    """
    Viewset for Person model views.
    """
    serializer_class = PersonSerializer

    def get_queryset(self):
        queryset = Person.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            # If a search term (q) is present, filter queryset by term against `full_name`
            queryset = queryset.filter(full_name__icontains=q)
        return queryset

    def bulk_delete(self, request):
        deleted = []
        ids = self.request.data.get('ids', None)

        if ids is not None:
            ids = ids.split(',')
            for id in ids:
                try:
                    Person.objects.get(pk=id).delete()
                    deleted.append(id)
                except:
                    pass

        data = {
            'deleted': deleted
        }

        return Response(data)

class TagViewSet(viewsets.ModelViewSet):
    """
    Viewset for Tag model views.
    """
    serializer_class = TagSerializer

    def get_queryset(self):
        queryset = Tag.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            # If a search term (q) is present, filter queryset by term against `name`
            queryset = queryset.filter(name__icontains=q)
        return queryset

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            resource = serializer.save()
            status_code = status.HTTP_201_CREATED
        except APIException:
            instance = Tag.objects.get(name=request.data.get('name'))
            serializer = self.get_serializer(instance)
            status_code = status.HTTP_200_OK
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status_code, headers=headers)

class TopicViewSet(viewsets.ModelViewSet):
    """
    Viewset for Topic model views.
    """
    serializer_class = TopicSerializer

    def get_queryset(self):
        queryset = Topic.objects.order_by('-last_used')
        q = self.request.query_params.get('q', None)
        if q is not None:
            # If a search term (q) is present, filter queryset by term against `name`
            queryset = queryset.filter(name__icontains=q)
        return queryset

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            resource = serializer.save()
            status_code = status.HTTP_201_CREATED
        except APIException:
            instance = Topic.objects.get(name=request.data.get('name'))
            serializer = self.get_serializer(instance)
            status_code = status.HTTP_200_OK
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status_code, headers=headers)

class ImageViewSet(viewsets.ModelViewSet):
    """
    Viewset for Image model views.
    """
    model = Image
    serializer_class = ImageSerializer
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('created_at',)

    def create(self, request, *args, **kwargs):
        authors = request.POST.get('authors', None)

        # If filename is not valid ASCII, don't add to DB and send error
        if not all(ord(c) < 128 for c in request.data.get('img').name):
            return Response(status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

        if authors is None:
            # Set author to current user if no authors are passed
            authors = [request.user.id]
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        resource = serializer.save()
        resource.save_authors(authors) # Handle author saving
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):

        authors = request.data.get('author_ids', False)

        partial = kwargs.pop('partial', False)

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        resource = serializer.save()

        if authors:
            resource.save_authors(authors)

        return Response(serializer.data)

    def get_queryset(self):
        queryset = Image.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            queryset = queryset.filter(Q(title__icontains=q) | Q(img__icontains=q) )
        return queryset

class ImageGalleryViewSet(viewsets.ModelViewSet):
    """
    Viewset for ImageGallery model views.
    """
    serializer_class = ImageGallerySerializer

    paginate_by = 30
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('created_at',)

    queryset = ImageGallery.objects.all()


class ComponentViewSet(viewsets.GenericViewSet):

    components = ThemeHelper.get_theme_components()
    pages = ThemeHelper.get_theme_pages()

    def detail(self, request, slug=None):
        spots_list = []
        components_dict = {}
        saved_dict = {}

        page = self.pages.get(slug)

        try:
            instance = ComponentSet.objects.get(slug=slug)

            for component in instance.components.all():
                component_class = self.components.get(component.slug)
                component_obj = component_class(instance=component)
                saved_dict[component.spot] = {
                    'slug': component.slug,
                    'fields': component_obj.field_data_as_json(),
                }
        except:
            pass

        for spot, name in page.component_spots:
            options = []
            for component in self.components.get_for_spot(spot):
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
            'saved': saved_dict,
        }

        return Response(data)

    def update(self, request, slug=None):

        try:
            update_status = status.HTTP_200_OK
            instance = ComponentSet.objects.get(slug=slug)
        except:
            update_status = status.HTTP_201_CREATED
            instance = ComponentSet(slug=slug)
            instance.save()

        component_slug = request.POST.get('component')
        spot = request.POST.get('spot')

        component_class = self.components.get(component_slug)

        try:
            component_instance = Component.objects.get(page=instance, spot=spot)
            if component_instance.slug == component_slug:
                component_obj = component_class(request.POST, instance=component_instance, spot=spot)
            else:
                instance.components.remove(instance)
                raise Exception()
        except:
            component_obj = component_class(request.POST, spot=spot)

        component_instance = component_obj.save()

        instance.components.add(component_instance)

        instance.save()

        data = {
            'saved': True
        }

        return Response(data, status=update_status)

class TemplateViewSet(viewsets.GenericViewSet):

    def list(self, request):
        templates = []
        for template in ThemeHelper.get_theme_templates():
            templates.append(template().to_json())

        data = {
            'results': templates
        }

        return Response(data)

class TrendingViewSet(viewsets.GenericViewSet):

    def list(self, request):
        data = {
            "count": 3,
            "next": None,
            "previous": None,
            "results": [
                {
                    "source": "instagram",
                    "name": "University of British Columbia",
                    "handle": "ubcaplaceofmind",
                    "timestamp": "2015-07-02T22:26:34Z",
                    "url": "https://instagram.com/p/5Z8dWHsDYh/",
                    "image": "https://scontent-sea1-1.cdninstagram.com/hphotos-xpa1/t51.2885-15/10864817_505702442914268_993541537_n.jpg",
                    "content": "Sailing on a boat with 120 strangers and no land in sight for 2 months might be a nightmare for some, but for Diane Hanano, Project Manager of the Pacific Centre for Isotopic and Geochemical Research at #UBC Science, the chance to sail on @joides_resolution was a dream come true."
                },
                {
                    "source": "twitter",
                    "name": "Jean-Francois Caron",
                    "handle": "jf_bikes",
                    "timestamp": "2015-07-02T22:26:34Z",
                    "url": "https://twitter.com/jf_bikes/status/620705871882924032",
                    "content": "@ubc_candcp @UBC The whole campus should be no-smoking except in special zones. Why enable an unhealthy & dangerous addiction?"
                },
                {
                    "source": "reddit",
                    "handle": "bugsahoy",
                    "timestamp": "2015-07-02T22:26:34Z",
                    "url": "http://www.reddit.com/r/UBC/comments/3dvwnp/how_is_first_year_dormcampus_life/",
                    "title": "How is first year dorm/campus life?",
                },

            ]
        }

        return Response(data)

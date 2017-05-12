from django.template.loader import render_to_string
from django.db.models import Q
from django.contrib.auth import authenticate

from rest_framework import viewsets, mixins, filters, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import detail_route, api_view, authentication_classes, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.exceptions import APIException, NotFound
from rest_framework.authtoken.models import Token

from dispatch.helpers.theme import ThemeHelper
from dispatch.apps.core.integrations import integrationLib, IntegrationNotFound, IntegrationCallbackError
from dispatch.apps.core.actions import list_actions, recent_articles
from dispatch.apps.core.models import Person
from dispatch.apps.frontend.models import ComponentSet, Component
from dispatch.apps.content.models import Article, Page, Section, Tag, Topic, Image, ImageAttachment, ImageGallery, File
from dispatch.apps.api.mixins import DispatchModelViewSet, DispatchPublishableMixin
from dispatch.apps.api.serializers import (ArticleSerializer, PageSerializer, SectionSerializer, ImageSerializer, FileSerializer,
                                           ImageGallerySerializer, TagSerializer, TopicSerializer, PersonSerializer, UserSerializer, IntegrationSerializer)

class SectionViewSet(DispatchModelViewSet):
    """
    Viewset for Section model views.
    """
    model = Section
    serializer_class = SectionSerializer

    def get_queryset(self):
        queryset = Section.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            # If a search term (q) is present, filter queryset by term against `name`
            queryset = queryset.filter(name__icontains=q)
        return queryset

class ArticleViewSet(DispatchModelViewSet, DispatchPublishableMixin):
    """
    Viewset for Article model views.
    """
    model = Article
    serializer_class = ArticleSerializer
    lookup_field = 'parent_id'

    def get_queryset(self):
        """
        Optionally restricts the returned articles by filtering
        against a `topic` query parameter in the URL.
        """

        # Get base queryset from DispatchPublishableMixin
        queryset = self.get_publishable_queryset()

        queryset = queryset.order_by('-updated_at')

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

class PageViewSet(DispatchModelViewSet, DispatchPublishableMixin):
    """
    Viewset for Page model views.
    """
    model = Page
    serializer_class = PageSerializer
    lookup_field = 'parent_id'

    def get_queryset(self):
        """
        Only display unpublished content to authenticated users, filter by query parameter if present.
        """

        # Get base queryset from DispatchPublishableMixin
        queryset = self.get_publishable_queryset()

        queryset = queryset.order_by('-updated_at')

        # Optionally filter by a query parameter
        q = self.request.query_params.get('q')

        if q:
            queryset = queryset.filter(title__icontains=q)

        return queryset

    @detail_route(methods=['get'],)
    def revision(self, request, parent_id=None):
        revision_id = request.query_params.get('revision_id', None)
        filter_kwargs = {
            'parent_id': parent_id,
            'revision_id': revision_id,
        }
        queryset = Page.objects.all()
        instance = self.get_object_or_404(**filter_kwargs)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class PersonViewSet(DispatchModelViewSet):
    """
    Viewset for Person model views.
    """
    model = Person
    serializer_class = PersonSerializer

    def get_queryset(self):
        queryset = Person.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            # If a search term (q) is present, filter queryset by term against `full_name`
            queryset = queryset.filter(full_name__icontains=q)
        return queryset

class TagViewSet(DispatchModelViewSet):
    """
    Viewset for Tag model views.
    """
    model = Tag
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

class TopicViewSet(DispatchModelViewSet):
    """
    Viewset for Topic model views.
    """
    model = Topic
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

class FileViewSet(DispatchModelViewSet):
    """
    Viewset for File model views.
    """
    model = File
    serializer_class = FileSerializer

    def get_queryset(self):
        queryset = File.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            # If a search term (q) is present, filter queryset by term against `name`
            queryset = queryset.filter(name__icontains=q)
        return queryset

class ImageViewSet(viewsets.ModelViewSet):
    """
    Viewset for Image model views.
    """
    model = Image
    serializer_class = ImageSerializer
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('created_at',)
    update_fields = ('title', 'authors')

    def get_queryset(self):
        queryset = Image.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            queryset = queryset.filter(Q(title__icontains=q) | Q(img__icontains=q) )
        return queryset

class ImageGalleryViewSet(DispatchModelViewSet):
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

    permission_classes = (IsAuthenticated,)

    def list(self, request):

        templates = [T().to_json() for T in ThemeHelper.get_theme_templates()]

        data = {
            'results': templates
        }

        return Response(data)

    def retrieve(self, request, pk=None):

        Template = ThemeHelper.get_theme_template(template_slug=pk)

        data = Template().to_json()

        return Response(data)

class IntegrationViewSet(viewsets.GenericViewSet):
    """
    Viewset for Dispatch integrations.
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = IntegrationSerializer

    def get_object_or_404(self, pk=None):
        try:
            return integrationLib.get(pk)
        except IntegrationNotFound:
            raise NotFound('That integration does not exist')

    def get_paginated_response(self, data):
        return Response({
            'count': len(data),
            'results': data
        })

    def list(self, request):

        integrations = integrationLib.list()

        serializer = self.get_serializer(integrations, many=True)

        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):

        integration = self.get_object_or_404(pk)

        serializer = self.get_serializer(integration)

        return Response(serializer.data)

    def partial_update(self, request, pk=None):

        integration = self.get_object_or_404(pk)

        serializer = self.get_serializer(integration, data=request.data)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(serializer.to_representation(integration))

    def destroy(self, request, pk=None):

        integration = self.get_object_or_404(pk)

        integration.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @detail_route(methods=['get'],)
    def callback(self, request, pk=None):

        integration = self.get_object_or_404(pk)

        try:
            data = integration.callback(request.user, request.GET)
        except IntegrationCallbackError, e:
            return Response({ 'detail': e.message}, status.HTTP_400_BAD_REQUEST)

        return Response(data)

class DashboardViewSet(viewsets.GenericViewSet):

    permission_classes = (IsAuthenticated,)
    serializer_class = ArticleSerializer

    def list_actions(self, request):

        actions = list_actions()

        data = {
            'results': actions
        }

        return Response(data)

    def list_recent_articles(self, request):

        recent = recent_articles(request.user)

        articles = map(lambda a: self.get_serializer(a).data, recent)

        data = {
            'results': articles
        }

        return Response(data)

@api_view(['POST'])
@permission_classes((AllowAny,))
def user_authenticate(request):

    email = request.data.get('email', None)
    password = request.data.get('password', None)

    user = authenticate(username=email, password=password)

    if user is not None and user.is_active:

        (token, created) = Token.objects.get_or_create(user=user)

        data = {
            'token': unicode(token)
        }

        return Response(data, status=status.HTTP_202_ACCEPTED)
    else:
        return Response({}, status=status.HTTP_400_BAD_REQUEST)

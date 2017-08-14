from django.template.loader import render_to_string
from django.db.models import Q, ProtectedError
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

from dispatch.apps.core.models import Person, User
from dispatch.apps.content.models import Article, Page, Section, Tag, Topic, Image, ImageAttachment, ImageGallery, File
from dispatch.apps.events.models import Event

from dispatch.apps.api.mixins import DispatchModelViewSet, DispatchPublishableMixin
from dispatch.apps.api.serializers import (
    ArticleSerializer, PageSerializer, SectionSerializer, ImageSerializer, FileSerializer,
    ImageGallerySerializer, TagSerializer, TopicSerializer, PersonSerializer, UserSerializer,
    IntegrationSerializer, ZoneSerializer, WidgetSerializer, EventSerializer)
from dispatch.apps.api.exceptions import ProtectedResourceError, BadCredentials

from dispatch.theme import ThemeManager
from dispatch.theme.exceptions import ZoneNotFound

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

        q = self.request.query_params.get('q', None)
        section = self.request.query_params.get('section', None)

        if q is not None:
            queryset = queryset.filter(headline__icontains=q)

        if section is not None:
            queryset = queryset.filter(section_id=section)

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

class PersonViewSet(DispatchModelViewSet):
    """Viewset for Person model views."""
    model = Person
    serializer_class = PersonSerializer

    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = Person.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            # If a search term (q) is present, filter queryset by term against `full_name`
            queryset = queryset.filter(full_name__icontains=q)
        return queryset

    def perform_destroy(self, instance):
        try:
            instance.delete()
        except ProtectedError:
            raise ProtectedResourceError('Deletion failed because person belongs to a user')

class UserViewSet(DispatchModelViewSet):
    """Viewset for User model views."""

    model = User
    serializer_class = UserSerializer

    queryset = User.objects.all()

    permission_classes = (IsAuthenticated,)

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

    model = ImageGallery
    serializer_class = ImageGallerySerializer

    paginate_by = 30
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('created_at',)

    queryset = ImageGallery.objects.all()

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

class ZoneViewSet(viewsets.GenericViewSet):
    """Viewset for widget zones"""

    permission_classes = (IsAuthenticated,)

    def get_object_or_404(self, pk=None):
        try:
            return ThemeManager.Zones.get(pk)
        except ZoneNotFound:
            raise NotFound("The zone with id '%s' does not exist" % pk)

    def get_paginated_response(self, data):
        return Response({
            'count': len(data),
            'results': data
        })

    def list(self, request):

        zones = ThemeManager.Zones.list()

        serializer = ZoneSerializer(zones, many=True)

        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):

        zone = self.get_object_or_404(pk)

        serializer = ZoneSerializer(zone)

        return Response(serializer.data)

    def partial_update(self, request, pk=None):

        zone = self.get_object_or_404(pk)

        serializer = ZoneSerializer(zone, data=request.data)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(serializer.data)

    @detail_route(methods=['get'])
    def widgets(self, request, pk=None):

        zone = self.get_object_or_404(pk)

        serializer = WidgetSerializer(zone.widgets, many=True)

        return self.get_paginated_response(serializer.data)

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

class EventViewSet(DispatchModelViewSet):
    """ViewSet for Event"""

    model = Event
    serializer_class = EventSerializer

    def get_queryset(self):

        if self.request.user.is_authenticated():
            queryset = Event.objects.all()
        else:
            queryset = Event.objects.filter(
                Q(is_submission=False),
                Q(is_published=True)
            )

        q = self.request.query_params.get('q', None)
        pending = self.request.query_params.get('pending', None)

        if q:
            queryset = queryset.filter(
                Q(title__icontains=q) |
                Q(description__icontains=q) |
                Q(host__icontains=q) |
                Q(category__iexact=q)
            )

        if pending == '1':
            queryset = queryset.filter(is_submission=True)
        elif pending == '0':
            queryset = queryset.filter(is_submission=False)

        return queryset


@permission_classes((AllowAny,))
class TokenViewSet(viewsets.ViewSet):

    def create(self, request):

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
            raise BadCredentials()

    def retrieve(self, request, pk):
        try:
            token = Token.objects.get(key=pk)
        except Token.DoesNotExist:
            return Response({'token_valid': False}, status=status.HTTP_404_NOT_FOUND)

        return Response({'token_valid': True})

    def delete(self, request):
        token = get_object_or_404(Token, user=request.user)

        token.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

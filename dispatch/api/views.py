from django.db.models import Q, ProtectedError, Prefetch
from django.contrib.auth import authenticate
from django.conf import settings
from django.db import IntegrityError

from rest_framework import viewsets, mixins, filters, status
from rest_framework.response import Response
from rest_framework.permissions import (
    AllowAny, IsAuthenticated, DjangoModelPermissions)
from rest_framework.decorators import (
    detail_route, api_view, authentication_classes, permission_classes)
from rest_framework.generics import get_object_or_404
from rest_framework.exceptions import APIException, NotFound
from rest_framework.authtoken.models import Token

from dispatch.modules.integrations.integrations import (
    integrationLib, IntegrationNotFound, IntegrationCallbackError)
from dispatch.modules.actions.actions import list_actions, recent_articles

from dispatch.models import (
    Article, File, Image, ImageAttachment, ImageGallery, Issue,
    Page, Author, Person, Section, Tag, Topic, User, Video,
    Poll, PollAnswer, PollVote, Invite)

from dispatch.core.settings import get_settings
from dispatch.admin.registration import reset_password

from dispatch.api.mixins import DispatchModelViewSet, DispatchPublishableMixin
from dispatch.api.serializers import (
    ArticleSerializer, PageSerializer, SectionSerializer, ImageSerializer,
    FileSerializer, IssueSerializer, ImageGallerySerializer, TagSerializer,
    TopicSerializer, PersonSerializer, UserSerializer, IntegrationSerializer,
    ZoneSerializer, WidgetSerializer, TemplateSerializer, VideoSerializer,
    PollSerializer, PollVoteSerializer, InviteSerializer)
from dispatch.api.exceptions import (
    ProtectedResourceError, BadCredentials, PollClosed, InvalidPoll,
    UnpermittedActionError)

from dispatch.theme import ThemeManager
from dispatch.theme.exceptions import ZoneNotFound, TemplateNotFound

class SectionViewSet(DispatchModelViewSet):
    """Viewset for Section model views."""
    model = Section
    serializer_class = SectionSerializer

    def get_queryset(self):
        queryset = Section.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            # If a search term (q) is present, filter queryset by term against `name`
            queryset = queryset.filter(name__icontains=q)
        return queryset

class VideoViewSet(DispatchModelViewSet):
    """Viewset for Video model views."""
    model = Video
    serializer_class = VideoSerializer

    def get_queryset(self):
        queryset = Video.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            # If a search term (q) is present, filter queryset by term against `title`
            queryset = queryset.filter(title__icontains=q)
        return queryset

class ArticleViewSet(DispatchModelViewSet, DispatchPublishableMixin):
    """Viewset for Article model views."""
    model = Article
    serializer_class = ArticleSerializer
    lookup_field = 'parent_id'

    def get_queryset(self):
        """Optionally restricts the returned articles by filtering against a `topic`
        query parameter in the URL."""

        # Get base queryset from DispatchPublishableMixin
        queryset = self.get_publishable_queryset()

        # Optimize queries by prefetching related data
        queryset = queryset \
            .select_related('featured_image', 'topic', 'section') \
            .prefetch_related(
                'tags',
                'featured_image__image__authors',
                'authors'
            )

        queryset = queryset.order_by('-updated_at') 

        q = self.request.query_params.get('q', None)
        section = self.request.query_params.get('section', None)
        tags = self.request.query_params.getlist('tags', None)
        author = self.request.query_params.get('author', None)

        if q is not None:
            queryset = queryset.filter(headline__icontains=q)

        if section is not None:
            queryset = queryset.filter(section_id=section)
        
        if tags is not None:
            for tag in tags:
                queryset = queryset.filter(tags__id=tag)

        if author is not None:
            queryset = queryset.filter(authors__person_id=author)

        return queryset

class PageViewSet(DispatchModelViewSet, DispatchPublishableMixin):
    """Viewset for Page model views."""
    model = Page
    serializer_class = PageSerializer
    lookup_field = 'parent_id'

    def get_queryset(self):
        """Only display unpublished content to authenticated users, filter by
        query parameter if present."""

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
            raise ProtectedResourceError(
                'Deletion failed because person belongs to a user'
            )

    @detail_route(methods=['get'])
    def user(self, request, pk=None):
        queryset = Person.objects.all()

        person = get_object_or_404(queryset, pk=pk)

        try:
            user = User.objects.get(person=person)
            serializer = UserSerializer(user)
        except User.DoesNotExist:
            return Response()

        return Response(serializer.data)

    @detail_route(methods=['get'])
    def invite(self, request, pk=None):
        queryset = Person.objects.all()

        person = get_object_or_404(queryset, pk=pk)

        try:
            invite = Invite.objects.get(person=person)
            serializer = InviteSerializer(invite)
        except Invite.DoesNotExist:
            return Response({'detail': 'Person has no invitation'})

        return Response(serializer.data)


class InviteViewSet(DispatchModelViewSet):
    """Viewset for the Invite model views."""
    model = Invite
    serializer_class = InviteSerializer

    permission_classes = (DjangoModelPermissions,)

    def get_queryset(self):
        queryset = Invite.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            queryset = queryset.filter(person__id=q)
        return queryset

class UserViewSet(DispatchModelViewSet):
    """Viewset for User model views."""
    model = User
    serializer_class = UserSerializer

    queryset = User.objects.all()

    def get_permissions(self):
        if self.request.method == 'PATCH':
            self.permission_classes = [IsAuthenticated, ]
        else:
            self.permission_classes = [DjangoModelPermissions, ]
        return super(UserViewSet, self).get_permissions()

    def get_queryset(self):
        queryset = User.objects.all()
        q = self.request.query_params.get('q', None)

        if q is not None:
            queryset = queryset.filter(person__id=q)
        return queryset

    def retrieve(self, request, pk=None):
        queryset = User.objects.all()

        if pk == 'me':
            pk = request.user.id

        user = get_object_or_404(queryset, pk=pk)
        serializer = UserSerializer(user)

        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        user = User.objects.get(pk=pk)

        if user != request.user and not request.user.has_perm('dispatch.change_user'):
            raise UnpermittedActionError()

        permissions = request.data.get('permissions', None)
        user.modify_permissions(permissions)

        return super(UserViewSet, self).partial_update(request)

    @detail_route(methods=['post'])
    def reset_password(self, request, pk=None):
        user = get_object_or_404(User.objects.all(), pk=pk)

        if request.user.has_perm('dispatch.change_user'):
            reset_password(user.email, request)
            return Response(status.HTTP_202_ACCEPTED)
        else:
            raise UnpermittedActionError()

class TagViewSet(DispatchModelViewSet):
    """Viewset for Tag model views."""
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
    """Viewset for Topic model views."""
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
    """Viewset for File model views."""
    model = File
    serializer_class = FileSerializer

    def get_queryset(self):
        queryset = File.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            # If a search term (q) is present, filter queryset by term against `name`
            queryset = queryset.filter(name__icontains=q)
        return queryset

class IssueViewSet(DispatchModelViewSet):
    """Viewset for Issue model views."""
    model = Issue
    serializer_class = IssueSerializer

    def get_queryset(self):
        queryset = Issue.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            # If a search term (q) is present, filter queryset by term against `name`
            queryset = queryset.filter(title__icontains=q)
        return queryset

class ImageViewSet(viewsets.ModelViewSet):
    """Viewset for Image model views."""
    model = Image
    serializer_class = ImageSerializer
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('created_at',)
    update_fields = ('title', 'authors', 'tags')

    def get_queryset(self):
        queryset = Image.objects.all()

        author = self.request.query_params.get('author', None)
        tags = self.request.query_params.getlist('tags', None)
        q = self.request.query_params.get('q', None)

        if author is not None:
            queryset = queryset.filter(authors__person_id=author)

        if tags is not None:
            for tag in tags:
                queryset = queryset.filter(tags__id=tag)

        if q is not None:
            queryset = queryset.filter(Q(title__icontains=q) | Q(img__icontains=q))

        return queryset

class ImageGalleryViewSet(DispatchModelViewSet):
    """Viewset for ImageGallery model views."""
    model = ImageGallery
    serializer_class = ImageGallerySerializer

    paginate_by = 30
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('created_at',)

    def get_queryset(self):
        queryset = ImageGallery.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            # If a search term (q) is present, filter queryset by term against `title`
            queryset = queryset.filter(title__icontains=q)
        return queryset

class PollViewSet(DispatchModelViewSet):
    """Viewset for the Poll model views."""
    model = Poll
    serializer_class = PollSerializer

    def get_queryset(self):
        queryset = Poll.objects.all()
        q = self.request.query_params.get('q', None)
        if q is not None:
            queryset = queryset.filter(Q(name__icontains=q) | Q(question__icontains=q) )
        return queryset

    @detail_route(permission_classes=[AllowAny], methods=['post'],)
    def vote(self, request, pk=None):
        poll = get_object_or_404(Poll.objects.all(), pk=pk)

        if not poll.is_open:
            raise PollClosed()

        answer = get_object_or_404(PollAnswer.objects.all(), pk=request.data['answer_id'])

        if answer.poll != poll:
            raise InvalidPoll()

        # Change vote
        if 'vote_id' in request.data:
            vote_id = request.data['vote_id']
            vote = PollVote.objects.filter(answer__poll=poll, id=vote_id) \
                .update(answer=answer)
            return Response({'id': vote_id})

        serializer = PollVoteSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

class TemplateViewSet(viewsets.GenericViewSet):
    """Viewset for Template views."""
    permission_classes = (IsAuthenticated,)

    def get_object_or_404(self, pk=None):
        try:
            return ThemeManager.Templates.get(pk)
        except TemplateNotFound:
            raise NotFound("The template with id '%s' does not exist" % pk)

    def get_paginated_response(self, data):
        return Response({
            'count': len(data),
            'results': data
        })

    def list(self, request):
        templates = ThemeManager.Templates.list()
        serializer = TemplateSerializer(templates, many=True)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        template = self.get_object_or_404(pk)
        serializer = TemplateSerializer(template)
        return Response(serializer.data)

class IntegrationViewSet(viewsets.GenericViewSet):
    """Viewset for Dispatch integrations."""
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
            return Response({ 'detail': e.message }, status.HTTP_400_BAD_REQUEST)

        return Response(data)

class ZoneViewSet(viewsets.GenericViewSet):
    """Viewset for widget zones."""

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
        q = request.query_params.get('q', None)
        if q is not None:
            zones = ThemeManager.Zones.search(q)
        else:
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

@permission_classes((AllowAny,))
class TokenViewSet(viewsets.ViewSet):
    def create(self, request):
        email = request.data.get('email', None)
        password = request.data.get('password', None)

        user = authenticate(username=email, password=password)

        if user is not None and user.is_active:
            (token, created) = Token.objects.get_or_create(user=user)

            settings = get_settings(token)

            data = {
                'token': unicode(token),
                'settings': settings
            }

            return Response(data, status=status.HTTP_202_ACCEPTED)
        else:
            raise BadCredentials()

    def retrieve(self, request, pk):
        try:
            token = Token.objects.get(key=pk)
        except Token.DoesNotExist:
            return Response({'token_valid': False}, status=status.HTTP_404_NOT_FOUND)

        settings = get_settings(token)

        return Response({
            'token_valid': True,
            'settings': settings
        })

    def delete(self, request):
        token = get_object_or_404(Token, user=request.user)

        token.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

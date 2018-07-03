from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import HyperlinkedModelSerializer

from dispatch.core.signals import post_create, post_update, post_publish, post_unpublish
from dispatch.models import Subscription

from pywebpush import webpush, WebPushException

import json

class DispatchModelViewSet(ModelViewSet):
    """Custom viewset to add Dispatch signals to default ModelViewSet"""

    def perform_create(self, serializer):
        # Override perform_create to send post_create signal
        instance = serializer.save()
        post_create.send(
            sender=self.model,
            instance=instance,
            user=self.request.user)

    def perform_update(self, serializer):
        # Override perform_update to send post_update signal
        instance = serializer.save()
        post_update.send(
            sender=self.model,
            instance=instance,
            user=self.request.user)

class DispatchPublishableMixin(object):
    """Custom mixin that adds publish, unpublish routes to ModelViewSet"""

    def get_publishable_queryset(self):

        # Only show unpublished articles to authenticated users
        if self.request.user.is_authenticated():
            queryset = self.model.objects.all()

            version = self.request.query_params.get('version', None)

            if version is not None:
                queryset = queryset.filter(revision_id=version)
            else:
                queryset = queryset.filter(head=True)
        else:
            queryset = self.model.objects.filter(is_published=True)

        return queryset

    def perform_publish(self, serializer):
        # Publish instance and send post_publish signal
        instance = serializer.publish()
        post_publish.send(
            sender=self.model,
            instance=instance,
            user=self.request.user)

    def perform_unpublish(self, serializer):
        # Unpublish instance and send post_unpublish signal
        instance = serializer.unpublish()
        post_unpublish.send(
            sender=self.model,
            instance=instance,
            user=self.request.user)

    @detail_route(methods=['post'])
    def publish(self, request, parent_id=None):

        instance = self.get_object()

        serializer = self.get_serializer(instance)

        self.perform_publish(serializer)

        # check for if article is breaking
        self.pushNotification(instance)
        
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def unpublish(self, request, parent_id=None):

        instance = self.get_object()

        serializer = self.get_serializer(instance)

        self.perform_unpublish(serializer)

        return Response(serializer.data)

    def pushNotification(self, article, pk=None):
        # grab each endpoint from list in database and make a push

        data={
            'headline': article.headline,
            'url': article.get_absolute_url(),
            'snippet': article.snippet,
            'image': article.featured_image.image.get_thumbnail_url()
        }
        subscriptions = Subscription.objects.all()
        for sub in subscriptions:
            print(sub.created_at)
            try:
                webpush(
                    subscription_info={
                        "endpoint": sub.endpoint,
                        "keys": {
                            "p256dh": sub.p256dh,
                            "auth": sub.auth
                        }},
                    data=json.dumps(data),
                    vapid_private_key="Mp2OSApC5ZQ11iHtKfTfAWycrr-YYl9yphpkeqKIy9E",
                    vapid_claims={
                            "sub": "mailto:YourNameHere@example.org===",
                        }
                )
                print('SUCCESS', sub.endpoint)
            except WebPushException as ex:
                print("FAILURE: {}", repr(ex), sub.created_at)
                sub.delete()


class DispatchModelSerializer(HyperlinkedModelSerializer):
    def __init__(self, *args, **kwargs):
        # Override default constructor to call hide_authenticated_fields
        super(DispatchModelSerializer, self).__init__(*args, **kwargs)

        self.hide_authenticated_fields()

    def is_authenticated(self):
        return (self.context.get('request') and
                self.context.get('request').user.is_authenticated())

    def hide_authenticated_fields(self):
        """Hides authenticated_fields if request context is missing or
        user is not authenticated"""
        authenticated_fields = getattr(self.Meta, 'authenticated_fields', [])

        if not self.is_authenticated():
            for field in authenticated_fields:
                self.fields.pop(field)

class DispatchPublishableSerializer(object):
    def publish(self):
        return self.instance.publish()

    def unpublish(self):
        return self.instance.unpublish()

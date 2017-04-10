from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import HyperlinkedModelSerializer

from dispatch.core.signals import post_create, post_update

class DispatchModelViewSet(ModelViewSet):
    """Custom viewset to add Dispatch signals to default ModelViewSet"""

    def perform_create(self, serializer):
        # Override perform_create to send post_create signal
        instance = serializer.save()
        post_create.send(sender=self.model, instance=instance, user=self.request.user)

    def perform_update(self, serializer):
        # Override perform_update to send post_update signal
        instance = serializer.save()
        post_update.send(sender=self.model, instance=instance, user=self.request.user)

class DispatchModelSerializer(HyperlinkedModelSerializer):

    def __init__(self, *args, **kwargs):
        # Override default constructor to call hide_authenticated_fields
        super(DispatchModelSerializer, self).__init__(*args, **kwargs)

        self.hide_authenticated_fields()

    def hide_authenticated_fields(self):
        """Hides authenticated_fields if request context is missing or user is not authenticated"""

        authenticated_fields = getattr(self.Meta, 'authenticated_fields', None)

        if not authenticated_fields:
            return

        if not self.context.get('request') or not self.context.get('request').user.is_authenticated():
            for field in authenticated_fields:
                self.fields.pop(field)

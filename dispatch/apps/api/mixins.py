from rest_framework.viewsets import ModelViewSet

from dispatch.core.signals import post_create, post_update

class DispatchModelViewSet(ModelViewSet):
    """Adds Dispatch signals to ModelViewSet"""

    def perform_create(self, serializer):
        """Override perform_create to send post_create signal"""
        instance = serializer.save()
        post_create.send(sender=self.model, instance=instance, user=self.request.user)

    def perform_update(self, serializer):
        """Override perform_update to send post_update signal"""
        instance = serializer.save()
        post_update.send(sender=self.model, instance=instance, user=self.request.user)


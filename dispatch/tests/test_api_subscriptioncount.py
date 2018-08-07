import datetime
from django.core.urlresolvers import reverse

from rest_framework import status

from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.models import SubscriptionCount, Subscription
from django.utils import timezone

class SubscriptionCountsTests(DispatchAPITestCase):

    def test_create_subscriptioncount(self):
        """Should be able to create a new subscription count"""

        url = reverse('api-subscriptioncount-list')

        response = self.client.post(url, None, format='json')

        subscription_count = Subscription.objects.all().count()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(SubscriptionCount.objects.all().first().count, subscription_count)

    def test_create_subscriptioncount_same_day(self):
        """Should only be able to create 1 subscription count per day"""

        url = reverse('api-subscriptioncount-list')

        SubscriptionCount.objects.create(count=0, date=datetime.datetime.today())
        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

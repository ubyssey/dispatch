import datetime
from django.core.urlresolvers import reverse

from rest_framework import status

from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.models import Notification, Article, Section
from django.utils import timezone

class NotificationsTests(DispatchAPITestCase):

    def test_create_notification_unauthorized(self):
        """Create notification should fail with unauthenticated request"""

        self.client.credentials()

        url = reverse('api-notifications-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_notification(self):
        """Ensure creating a notification works"""

        url = reverse('api-notifications-list')

        article = DispatchTestHelpers.create_article(self.client)

        data = {
            'article_id': article.data['id'],
            'scheduled_push_time': timezone.now() + datetime.timedelta(hours=1)
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(article.data['id'], response.data['article_id'])

    def test_update_notification(self):
        """Ensure updating a notification works"""
        section = Section.objects.create(name='Test Section', slug='test')

        article_1 = Article.objects.create(headline='Article 1', slug='article-1', section=section)
        article_2 = Article.objects.create(headline='Article 2', slug='article-2', section=section)

        notification = DispatchTestHelpers.create_notification(self.client, article=article_1)

        url = reverse('api-notifications-detail', args=[notification.data['id']])

        new_scheduled_push_time = timezone.now() + datetime.timedelta(hours=2)

        data = {
            'article_id': article_2.id,
            'scheduled_push_time': new_scheduled_push_time
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(article_2.id, response.data['article_id'])
        self.assertEqual(article_2.headline, response.data['article_headline'])
        self.assertEqual(new_scheduled_push_time.strftime('%Y-%m-%dT%H:%M:%S.%f'), response.data['scheduled_push_time'])

    def test_create_incomplete_notification(self):
        """Create notification should fail with missing required fields"""

        url = reverse('api-notifications-list')

        data = {

        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('article_id' in response.data)
        self.assertTrue('scheduled_push_time' in response.data)

    def test_delete_notification_unauthorized(self):
        """Delete notification should fail with unauthenticated request"""

        section = Section.objects.create(name='Test Section', slug='test')
        article_1 = Article.objects.create(headline='Article 1', slug='article-1', section=section)
        notification = DispatchTestHelpers.create_notification(self.client, article=article_1)

        self.client.credentials()

        url = reverse('api-notifications-detail', args=[notification.data['id']])

        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_notification(self):
        """Ensure deleting notification works"""
        section = Section.objects.create(name='Test Section', slug='test')
        article_1 = Article.objects.create(headline='Article 1', slug='article-1', section=section)
        notification = DispatchTestHelpers.create_notification(self.client, article=article_1)

        url = reverse('api-notifications-detail', args=[notification.data['id']])

        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_create_notification_on_publish(self):
        """Publishing an article that has a scheduled notification time should create a notification"""

        scheduled_push_time = timezone.now() + datetime.timedelta(hours=2)
        section = Section.objects.create(name='Test Section', slug='test')
        article = Article.objects.create(headline='Article 1', slug='article-1', section=section, scheduled_notification=scheduled_push_time)

        url = reverse('api-articles-publish', args=[article.id])
        response = self.client.post(url, format='json')

        self.assertTrue(Notification.objects.filter(article__id=article.id).exists())
        self.assertEqual(scheduled_push_time, Notification.objects.get(article__id=article.id).scheduled_push_time)

    def test_push_notifications(self):
        """A post request to /notifications/push should push the oldest notification and delete it"""

        section = Section.objects.create(name='Test Section', slug='test')

        article_1 = Article.objects.create(headline='Article 1', slug='article-1', section=section)

        url = reverse('api-articles-publish', args=[article_1.id])

        response = self.client.post(url, format='json')

        scheduled_push_time = timezone.now() - datetime.timedelta(hours=2)

        notification = DispatchTestHelpers.create_notification(self.client, article=article_1, scheduled_push_time=scheduled_push_time)

        url = reverse('api-notifications-push')

        response = self.client.post(url, format='json')

        self.assertFalse(Notification.objects.all().exists())

from django.core.urlresolvers import reverse

from rest_framework import status

from dispatch.tests.cases import DispatchAPITestCase

from dispatch.apps.content.models import Article, Person, Section

class ArticlesTests(DispatchAPITestCase):

    def _create_article(self):
        """
        Create a dummy article instance
        """

        # Create test person
        person = Person.objects.create(full_name='Test Person')
        person.save()

        # Create test section
        section = Section.objects.create(name='Test Section', slug='test')
        section.save()

        url = reverse('api-articles-list')

        data = {
            'headline': 'Test headline',
            'section_id': section.id,
            'author_ids': [person.id],
            'slug': 'test-article',
            'content_json': '[]'
        }

        return self.client.post(url, data, format='json')

    def test_create_article_unauthorized(self):
        """
        Create article should fail with unauthenticated request
        """

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-articles-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_empty_article(self):
        """
        Create article should fail with empty payload
        """

        url = reverse('api-articles-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_incomplete_article(self):
        """
        Create article should fail with missing required fields
        """

        url = reverse('api-articles-list')

        # Article data is missing authors, section, content, slug
        data = {
            'headline': 'Test headline',
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertTrue('author_ids' in response.data)
        self.assertTrue('content_json' in response.data)
        self.assertTrue('slug' in response.data)
        self.assertTrue('section_id' in response.data)

    def test_create_article(self):
        """
        Ensure that article can be created
        """

        response = self._create_article()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check data
        self.assertEqual(response.data['headline'], 'Test headline')
        self.assertEqual(response.data['section']['name'], 'Test Section')
        self.assertEqual(response.data['authors'][0]['full_name'], 'Test Person')
        self.assertEqual(response.data['slug'], 'test-article')

    def test_delete_article_unauthorized(self):
        """
        Delete article should fail with unauthenticated request
        """

        # Create an article
        article = self._create_article()

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-articles-detail', args=[article.data['id']])

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_article(self):
        """
        Ensure that article can be deleted
        """

        article = self._create_article()

        # Generate detail URL
        url = reverse('api-articles-detail', args=[article.data['id']])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Can't delete an article that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

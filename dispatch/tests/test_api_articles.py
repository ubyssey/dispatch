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

        # Create test section
        section = Section.objects.create(name='Test Section', slug='test')

        url = reverse('api-articles-list')

        data = {
            'headline': 'Test headline',
            'section_id': section.id,
            'author_ids': [person.id],
            'slug': 'test-article',
            'content': []
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
        self.assertTrue('content' in response.data)
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

    def test_publish_article(self):
        """
        Ensure that an existing article can be published
        """

        article = self._create_article()

        # Generate detail URL
        url = reverse('api-articles-publish', args=[article.data['id']])

        response = self.client.post(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['is_published'], True)

    def test_unpublish_article(self):
        """
        Ensure that an existing article can be unpublished
        """

        article = self._create_article()

        # Publish article first
        url = reverse('api-articles-publish', args=[article.data['id']])
        response = self.client.post(url, format='json')

        self.assertEqual(response.data['is_published'], True)

        # Now unpublish the article
        url = reverse('api-articles-unpublish', args=[article.data['id']])
        response = self.client.post(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['is_published'], False)

    def test_unpublish_article_older_version(self):
        """
        Ensure that an older version of an article can be unpublished
        """

        article = self._create_article()

        # Publish latest version
        url = reverse('api-articles-publish', args=[article.data['id']])
        response = self.client.post(url, format='json')

        self.assertEqual(response.data['is_published'], True)
        self.assertEqual(response.data['published_version'], 1)
        self.assertEqual(response.data['current_version'], 1)
        self.assertEqual(response.data['latest_version'], 1)

        # Update article to generate new version
        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.patch(url, { 'headline': 'Updated headline' }, format='json')

        self.assertEqual(response.data['headline'], 'Updated headline')
        self.assertEqual(response.data['is_published'], False)
        self.assertEqual(response.data['published_version'], 1)
        self.assertEqual(response.data['current_version'], 2)
        self.assertEqual(response.data['latest_version'], 2)

        # Now unpublish the article
        url = reverse('api-articles-unpublish', args=[article.data['id']])
        response = self.client.post(url, format='json')

        self.assertEqual(response.data['published_version'], None)
        self.assertEqual(response.data['current_version'], 2)
        self.assertEqual(response.data['latest_version'], 2)

    def test_publish_article_version(self):
        """
        Ensure that a specific version of an article can be published
        """

        article = self._create_article()

        # Update article to generate new version
        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.patch(url, { 'headline': 'Updated headline' }, format='json')

        self.assertEqual(response.data['headline'], 'Updated headline')
        self.assertEqual(response.data['is_published'], False)
        self.assertEqual(response.data['published_version'], None)
        self.assertEqual(response.data['current_version'], 2)
        self.assertEqual(response.data['latest_version'], 2)

        # Publish earlier version
        url = '%s?version=%d' % (reverse('api-articles-publish', args=[article.data['id']]), 1)
        response = self.client.post(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['headline'], 'Test headline')
        self.assertEqual(response.data['is_published'], True)
        self.assertEqual(response.data['published_version'], 1)
        self.assertEqual(response.data['current_version'], 1)
        self.assertEqual(response.data['latest_version'], 2)

    def test_publish_article_older_version(self):
        """
        Ensure that an older version of an article can be published
        """

        article = self._create_article()

        # Update article to generate new version
        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.patch(url, { 'headline': 'Updated headline' }, format='json')

        self.assertEqual(response.data['headline'], 'Updated headline')
        self.assertEqual(response.data['is_published'], False)
        self.assertEqual(response.data['published_version'], None)
        self.assertEqual(response.data['current_version'], 2)
        self.assertEqual(response.data['latest_version'], 2)

        # Publish latest version
        url = reverse('api-articles-publish', args=[article.data['id']])
        response = self.client.post(url, format='json')

        self.assertEqual(response.data['is_published'], True)
        self.assertEqual(response.data['published_version'], 2)
        self.assertEqual(response.data['current_version'], 2)
        self.assertEqual(response.data['latest_version'], 2)

        # Publish earlier version
        url = '%s?version=%d' % (reverse('api-articles-publish', args=[article.data['id']]), 1)
        response = self.client.post(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['is_published'], True)
        self.assertEqual(response.data['published_version'], 1)
        self.assertEqual(response.data['current_version'], 1)
        self.assertEqual(response.data['latest_version'], 2)

        # Check that latest version is no longer published
        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.get(url, format='json')

        self.assertEqual(response.data['current_version'], 2)
        self.assertEqual(response.data['is_published'], False)

    def test_publish_article_unauthorized(self):
        """
        Publish article should fail with unauthorized request
        """

        article = self._create_article()

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-articles-publish', args=[article.data['id']])
        response = self.client.post(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        articles = Article.objects.filter(parent_id=article.data['id'], is_published=True)

        self.assertEqual(len(articles), 0)

    def test_list_published_articles(self):
        """
        Unpublished articles should not be displayed to unauthorized users
        """

        section = Section.objects.create(name='Test Section', slug='test')

        article_1 = Article.objects.create(headline='Article 1', slug='article-1', section=section)
        article_2 = Article.objects.create(headline='Article 2', slug='article-2', section=section)
        article_3 = Article.objects.create(headline='Article 3', slug='article-3', section=section)

        # Publish second article
        url = reverse('api-articles-publish', args=[article_2.parent_id])
        response = self.client.post(url, format='json')

        url = reverse('api-articles-list')
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 3)

        # Clear client credentials
        self.client.credentials()

        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['slug'], 'article-2')

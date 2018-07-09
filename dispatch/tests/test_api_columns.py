from django.core.urlresolvers import reverse

from rest_framework import status

from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.models import Column, Article, Person, Section


class ColumnsTests(DispatchAPITestCase):

    def test_create_column_unauthorized(self):
        """Create column should fail with unauthenticated request"""

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-columns-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_empty_column(self):
        """Create column should fail with empty payload"""

        url = reverse('api-columns-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_incomplete_column(self):
        """Create column should fail with missing required fields"""

        url = reverse('api-columns-list')

        data = {
            'name': 'Test column'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertTrue('section_id' in response.data)
        self.assertTrue('slug' in response.data)
        self.assertTrue('author_ids' in response.data)


    def test_create_column(self):
        """Ensure that columns can be created"""

        response = DispatchTestHelpers.create_column(self.client)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check data
        self.assertEqual(response.data['name'], 'Test column')
        self.assertEqual(response.data['section']['name'], 'Test Section')
        self.assertEqual(response.data['authors'][0]['person']['full_name'], 'Test Person')
        self.assertEqual(response.data['slug'], 'test-column')


    def test_create_column_exisiting_slug(self):
        """Ensure that the column doesn't have a slug matching an existing column"""

        response = DispatchTestHelpers.create_column(self.client, article_headlines=['Test-article-1','Test-article-2'])

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = DispatchTestHelpers.create_column(self.client)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertTrue('slug' in response.data)


    def test_update_column(self):
        """Ensure that column's basic fields can be updated"""

        column = DispatchTestHelpers.create_column(self.client)

        NEW_NAME = 'New Name'
        NEW_SLUG = 'New-Slug'

        data = {
            'name': NEW_NAME,
            'slug': NEW_SLUG,
            'section_id': column.data['section']['id'],
            'author_ids': [],
            'article_ids': []
        }

        url = reverse('api-columns-detail', args=[column.data['id']])

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], NEW_NAME)
        self.assertEqual(response.data['slug'], NEW_SLUG)

    def test_update_column_exisiting_slug(self):
        """Ensure that the column doens't have a slug matching an existing column"""

        column_a = DispatchTestHelpers.create_column(self.client, name='column-a', slug='slug-a')
        column_b = DispatchTestHelpers.create_column(self.client, name='column-b', slug='slug-b', article_headlines=['Test-article-1','Test-article-2'])

        url = reverse('api-columns-detail', args=[column_b.data['id']])

        data = {
            'slug': 'slug-a',
            'author_ids': [{'person': 1, 'type': 'author'}],
            'article_ids': []
            }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('slug' in response.data)

    def test_update_column_exisiting_section_slug(self):
        """Ensure that the column doens't have a slug matching an existing column"""

        column = DispatchTestHelpers.create_column(self.client, name='column-a', slug='slug-a')

        url = reverse('api-columns-detail', args=[column.data['id']])

        data = {
            'slug': column.data['section']['slug'],
            'author_ids': [],
            'article_ids': []
            }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('slug' in response.data)

    def test_update_column_exisiting_page_slug(self):
        """Ensure that the column doens't have a slug matching an existing column"""

        column = DispatchTestHelpers.create_column(self.client, name='column-a', slug='slug-a')
        page = DispatchTestHelpers.create_page(self.client)
        url = reverse('api-columns-detail', args=[column.data['id']])

        data = {
            'slug': page.data['slug'],
            'author_ids': [],
            'article_ids': []
            }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('slug' in response.data)

    def test_update_column_unauthorized(self):
        """Update column should fail with unauthenticated request"""

        column = DispatchTestHelpers.create_column(self.client, name='column-a', slug='slug-a')

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-columns-detail', args=[column.data['id']])

        response = self.client.patch(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_column_articles(self):
        """Should be able to update and remove column articles"""

        column = DispatchTestHelpers.create_column(self.client, name='column-a', slug='slug-a')
        article_a = DispatchTestHelpers.create_article(self.client, slug='slug-a')
        article_b = DispatchTestHelpers.create_article(self.client, slug='slug-b')

        url = reverse('api-columns-detail', args=[column.data['id']])

        data = {
            'author_ids': [],
            'article_ids': [article_a.data['id'], article_b.data['id']]
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['articles']), 2)

    def test_update_column_authors(self):
        """Should be able to udpate and remove column authors"""

        column = DispatchTestHelpers.create_column(self.client, name='column-a', slug='slug-a')
        person_a = DispatchTestHelpers.create_person(self.client)
        person_b = DispatchTestHelpers.create_person(self.client)

        url = reverse('api-columns-detail', args=[column.data['id']])

        data = {
            'author_ids': [{'person': person_a.data['id'], 'type': 'author'}, {'person': person_b.data['id'], 'type': 'author'}],
            'article_ids': []
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['authors']), 2)

    def test_delete_column_unauthorized(self):
        """Delete column should fail with unauthenticated request"""

        column = DispatchTestHelpers.create_column(self.client, name='column-a', slug='slug-a')

        self.client.credentials()

        url = reverse('api-columns-detail', args=[column.data['id']])

        response = self.client.delete(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_column(self):
        """Ensure that columns can be deleted"""

        column = DispatchTestHelpers.create_column(self.client, name='column-a', slug='slug-a')

        url = reverse('api-columns-detail', args=[column.data['id']])

        response = self.client.delete(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_column_name_query(self):
        """Should be able to search for columns by name"""

        column_1 = DispatchTestHelpers.create_column(self.client, name='column 1', slug='slug-1')
        column_2 = DispatchTestHelpers.create_column(self.client, name='column 1 and 2', slug='slug-1-2', article_headlines=['Test-article-1','Test-article-2'])
        column_3 = DispatchTestHelpers.create_column(self.client, name='column 3', slug='slug-3', article_headlines=['Test-article-3', 'Test-article-4'])

        url = '%s?q=%s' % (reverse('api-columns-list'), 'column 1')
        response = self.client.get(url, format='json')

        self.assertEqual(response.data['results'][0]['name'], 'column 1')
        self.assertEqual(response.data['results'][1]['name'], 'column 1 and 2')
        self.assertEqual(response.data['count'], 2)

    def test_column_section_query(self):
        """Should be able to filter columns by section"""
        column_1 = DispatchTestHelpers.create_column(self.client, name='column 1', slug='slug-1', section='section a', slug_section='section-a')
        column_2 = DispatchTestHelpers.create_column(self.client, name='column 2', slug='slug-2', article_headlines=['Test-article-1','Test-article-2'], section='section a', slug_section='section-a')
        column_3 = DispatchTestHelpers.create_column(self.client, name='column 3', slug='slug-3', article_headlines=['Test-article-3', 'Test-article-4'], section='section b', slug_section='section-b')

        section_id = column_2.data['section']['id']

        url = '%s?section=%s' % (reverse('api-columns-list'), section_id)
        response = self.client.get(url, format='json')

        self.assertEqual(response.data['results'][0]['name'], 'column 1')
        self.assertEqual(response.data['results'][1]['name'], 'column 2')
        self.assertEqual(response.data['count'], 2)

    def test_add_article_to_column(self):
        """Should be able to add an article to a column"""
        column = DispatchTestHelpers.create_column(self.client)
        article = DispatchTestHelpers.create_article(self.client, column_id=column.data['id'])

        url = reverse('api-columns-detail', args=[column.data['id']])
        response = self.client.get(url, None, format='json')

        self.assertEqual(len(response.data['articles']), 1)

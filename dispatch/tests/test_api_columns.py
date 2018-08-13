from django.core.urlresolvers import reverse

from rest_framework import status

from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.models import Subsection, Article, Person, Section

class SubsectionsTests(DispatchAPITestCase):

    def test_create_subsection_unauthorized(self):
        """Create subsection should fail with unauthenticated request"""

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-subsections-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_empty_subsection(self):
        """Create subsection should fail with empty payload"""

        url = reverse('api-subsections-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_incomplete_subsection(self):
        """Create subsection should fail with missing required fields"""

        url = reverse('api-subsections-list')

        data = {
            'name': 'Test subsection'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertTrue('section_id' in response.data)
        self.assertTrue('slug' in response.data)
        self.assertTrue('author_ids' in response.data)

    def test_create_subsection(self):
        """Ensure that subsections can be created"""

        response = DispatchTestHelpers.create_subsection(self.client)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check data
        self.assertEqual(response.data['name'], 'Test subsection')
        self.assertEqual(response.data['section']['name'], 'Test Section')
        self.assertEqual(response.data['authors'][0]['person']['full_name'], 'Test Person')
        self.assertEqual(response.data['slug'], 'test-subsection')

    def test_create_subsection_exisiting_slug(self):
        """Ensure that the subsection doesn't have a slug matching an existing subsection"""

        response = DispatchTestHelpers.create_subsection(self.client, article_headlines=['Test-article-1','Test-article-2'])

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = DispatchTestHelpers.create_subsection(self.client)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertTrue('slug' in response.data)

    def test_update_subsection(self):
        """Ensure that subsection's basic fields can be updated"""

        subsection = DispatchTestHelpers.create_subsection(self.client)

        NEW_NAME = 'New Name'
        NEW_SLUG = 'New-Slug'

        data = {
            'name': NEW_NAME,
            'slug': NEW_SLUG,
            'section_id': subsection.data['section']['id'],
            'author_ids': [],
            'article_ids': []
        }

        url = reverse('api-subsections-detail', args=[subsection.data['id']])

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], NEW_NAME)
        self.assertEqual(response.data['slug'], NEW_SLUG)

    def test_update_subsection_exisiting_slug(self):
        """Ensure that the subsection doens't have a slug matching an existing subsection"""

        subsection_a = DispatchTestHelpers.create_subsection(self.client, name='subsection-a', slug='slug-a')
        subsection_b = DispatchTestHelpers.create_subsection(self.client, name='subsection-b', slug='slug-b', article_headlines=['Test-article-1','Test-article-2'])

        url = reverse('api-subsections-detail', args=[subsection_b.data['id']])

        data = {
            'slug': 'slug-a',
            'author_ids': [{'person': 1, 'type': 'author'}],
            'article_ids': []
            }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('slug' in response.data)

    def test_update_subsection_exisiting_section_slug(self):
        """Ensure that the subsection doens't have a slug matching an existing subsection"""

        subsection = DispatchTestHelpers.create_subsection(self.client, name='subsection-a', slug='slug-a')

        url = reverse('api-subsections-detail', args=[subsection.data['id']])

        data = {
            'slug': subsection.data['section']['slug'],
            'author_ids': [],
            'article_ids': []
            }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('slug' in response.data)

    def test_update_subsection_exisiting_page_slug(self):
        """Ensure that the subsection doens't have a slug matching an existing subsection"""

        subsection = DispatchTestHelpers.create_subsection(self.client, name='subsection-a', slug='slug-a')
        page = DispatchTestHelpers.create_page(self.client)
        url = reverse('api-subsections-detail', args=[subsection.data['id']])

        data = {
            'slug': page.data['slug'],
            'author_ids': [],
            'article_ids': []
            }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('slug' in response.data)

    def test_update_subsection_unauthorized(self):
        """Update subsection should fail with unauthenticated request"""

        subsection = DispatchTestHelpers.create_subsection(self.client, name='subsection-a', slug='slug-a')

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-subsections-detail', args=[subsection.data['id']])

        response = self.client.patch(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_subsection_articles(self):
        """Should be able to update and remove subsection articles"""

        subsection = DispatchTestHelpers.create_subsection(self.client, name='subsection-a', slug='slug-a')
        article_a = DispatchTestHelpers.create_article(self.client, slug='slug-a')
        article_b = DispatchTestHelpers.create_article(self.client, slug='slug-b')

        url = reverse('api-subsections-detail', args=[subsection.data['id']])

        data = {
            'author_ids': [],
            'article_ids': [article_a.data['id'], article_b.data['id']]
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['articles']), 2)

    def test_update_subsection_authors(self):
        """Should be able to udpate and remove subsection authors"""

        subsection = DispatchTestHelpers.create_subsection(self.client, name='subsection-a', slug='slug-a')
        person_a = DispatchTestHelpers.create_person(self.client)
        person_b = DispatchTestHelpers.create_person(self.client)

        url = reverse('api-subsections-detail', args=[subsection.data['id']])

        data = {
            'author_ids': [{'person': person_a.data['id'], 'type': 'author'}, {'person': person_b.data['id'], 'type': 'author'}],
            'article_ids': []
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['authors']), 2)

    def test_delete_subsection_unauthorized(self):
        """Delete subsection should fail with unauthenticated request"""

        subsection = DispatchTestHelpers.create_subsection(self.client, name='subsection-a', slug='slug-a')

        self.client.credentials()

        url = reverse('api-subsections-detail', args=[subsection.data['id']])

        response = self.client.delete(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_subsection(self):
        """Ensure that subsections can be deleted"""

        subsection = DispatchTestHelpers.create_subsection(self.client, name='subsection-a', slug='slug-a')

        url = reverse('api-subsections-detail', args=[subsection.data['id']])

        response = self.client.delete(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_subsection_name_query(self):
        """Should be able to search for subsections by name"""

        subsection_1 = DispatchTestHelpers.create_subsection(self.client, name='subsection 1', slug='slug-1')
        subsection_2 = DispatchTestHelpers.create_subsection(self.client, name='subsection 1 and 2', slug='slug-1-2', article_headlines=['Test-article-1','Test-article-2'])
        subsection_3 = DispatchTestHelpers.create_subsection(self.client, name='subsection 3', slug='slug-3', article_headlines=['Test-article-3', 'Test-article-4'])

        url = '%s?q=%s' % (reverse('api-subsections-list'), 'subsection 1')
        response = self.client.get(url, format='json')

        self.assertEqual(response.data['results'][0]['name'], 'subsection 1')
        self.assertEqual(response.data['results'][1]['name'], 'subsection 1 and 2')
        self.assertEqual(response.data['count'], 2)

    def test_subsection_section_query(self):
        """Should be able to filter subsections by section"""
        subsection_1 = DispatchTestHelpers.create_subsection(self.client, name='subsection 1', slug='slug-1', section='section a', slug_section='section-a')
        subsection_2 = DispatchTestHelpers.create_subsection(self.client, name='subsection 2', slug='slug-2', article_headlines=['Test-article-1','Test-article-2'], section='section a', slug_section='section-a')
        subsection_3 = DispatchTestHelpers.create_subsection(self.client, name='subsection 3', slug='slug-3', article_headlines=['Test-article-3', 'Test-article-4'], section='section b', slug_section='section-b')

        section_id = subsection_2.data['section']['id']

        url = '%s?section=%s' % (reverse('api-subsections-list'), section_id)
        response = self.client.get(url, format='json')

        self.assertEqual(response.data['results'][0]['name'], 'subsection 1')
        self.assertEqual(response.data['results'][1]['name'], 'subsection 2')
        self.assertEqual(response.data['count'], 2)

    def test_add_article_to_subsection(self):
        """Should be able to add an article to a subsection"""
        subsection = DispatchTestHelpers.create_subsection(self.client)
        article = DispatchTestHelpers.create_article(self.client, subsection_id=subsection.data['id'])

        url = reverse('api-subsections-detail', args=[subsection.data['id']])
        response = self.client.get(url, None, format='json')

        self.assertEqual(len(response.data['articles']), 1)

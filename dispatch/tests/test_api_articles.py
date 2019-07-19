import datetime
from django.urls import reverse

from rest_framework import status

from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.models import Article, Author, Person, Section
from dispatch.modules.content.mixins import AuthorMixin
from django.utils import timezone

class ArticlesTests(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_create_article_unauthorized(self):
        """Create article should fail with unauthenticated request"""

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-articles-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_empty_article(self):
        """Create article should fail with empty payload"""

        url = reverse('api-articles-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_incomplete_article(self):
        """Create article should fail with missing required fields"""

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
        """Ensure that article can be created"""

        response = DispatchTestHelpers.create_article(self.client)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check data
        self.assertEqual(response.data['headline'], 'Test headline')
        self.assertEqual(response.data['section']['name'], 'Test Section')
        self.assertEqual(response.data['authors'][0]['person']['full_name'], 'The Test Person')
        self.assertEqual(response.data['slug'], 'test-article')

    def test_create_article_existing_slug(self):
        """Ensure that article doesn't have slug matching existing article"""

        response = DispatchTestHelpers.create_article(self.client)

        NEW_HEADLINE = 'New Headline'
        NEW_SLUG = 'new-slug'
        NEW_SNIPPET = 'New snippet'
        NEW_IMPORTANCE = 5
        NEW_SEO_KEYWORD = 'new keyword'
        NEW_SEO_DESCRIPTION = 'new seo description'

        data = {
            'headline': NEW_HEADLINE,
            'slug': NEW_SLUG,
            'snippet': NEW_SNIPPET,
            'importance': NEW_IMPORTANCE,
            'seo_keyword': NEW_SEO_KEYWORD,
            'seo_description': NEW_SEO_DESCRIPTION
        }

        response = DispatchTestHelpers.create_article(self.client)

        NEW_HEADLINE_2 = 'New Headline 2'
        NEW_SLUG_2 = 'new-slug'
        NEW_SNIPPET_2 = 'New snippet 2'
        NEW_IMPORTANCE_2 = 5
        NEW_SEO_KEYWORD_2 = 'new keyword'
        NEW_SEO_DESCRIPTION_2 = 'new seo description'

        data = {
            'headline': NEW_HEADLINE_2,
            'slug': NEW_SLUG_2,
            'snippet': NEW_SNIPPET_2,
            'importance': NEW_IMPORTANCE_2,
            'seo_keyword': NEW_SEO_KEYWORD_2,
            'seo_description': NEW_SEO_DESCRIPTION_2
        }

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_article_existing_slug(self):
        """Ensure that article doesn't have slug matching existing article"""

        article_a = DispatchTestHelpers.create_article(self.client, slug='slug-a')
        article_b = DispatchTestHelpers.create_article(self.client, slug='slug-b')

        url = reverse('api-articles-detail', args=[article_b.data['id']])
        data = {'slug': 'slug-a'}

        # Update `article_b` with `slug-a`
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_article(self):
        """Update the basic fields of an article"""

        article = DispatchTestHelpers.create_article(self.client)

        NEW_HEADLINE = 'New Headline'
        NEW_SLUG = 'new-slug'
        NEW_SNIPPET = 'New snippet'
        NEW_IMPORTANCE = 5
        NEW_SEO_KEYWORD = 'new keyword'
        NEW_SEO_DESCRIPTION = 'new seo description'

        data = {
            'headline': NEW_HEADLINE,
            'slug': NEW_SLUG,
            'snippet': NEW_SNIPPET,
            'importance': NEW_IMPORTANCE,
            'seo_keyword': NEW_SEO_KEYWORD,
            'seo_description': NEW_SEO_DESCRIPTION
        }

        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['headline'], NEW_HEADLINE)
        self.assertEqual(response.data['slug'], NEW_SLUG)
        self.assertEqual(response.data['snippet'], NEW_SNIPPET)
        self.assertEqual(response.data['importance'], NEW_IMPORTANCE)
        self.assertEqual(response.data['seo_keyword'], NEW_SEO_KEYWORD)
        self.assertEqual(response.data['seo_description'], NEW_SEO_DESCRIPTION)

        self.assertNotEqual(article.data['headline'], NEW_HEADLINE)
        self.assertNotEqual(article.data['slug'], NEW_SLUG)
        self.assertNotEqual(article.data['snippet'], NEW_SNIPPET)
        self.assertNotEqual(article.data['importance'], NEW_IMPORTANCE)
        self.assertNotEqual(article.data['seo_keyword'], NEW_SEO_KEYWORD)
        self.assertNotEqual(article.data['seo_description'], NEW_SEO_DESCRIPTION)

    def test_author_type_string(self):

        url = reverse('api-articles-list')

        (person1, created) = Person.objects.get_or_create(full_name='Test Person', slug='test-person')
        (person2, created) = Person.objects.get_or_create(full_name='Test Person 2' , slug='test-person-2')
        (person3, created) = Person.objects.get_or_create(full_name='Test Person 3', slug='test-person-3')
        (person4, created) = Person.objects.get_or_create(full_name='Test Person 4', slug='test-person-4')
        (section, created) = Section.objects.get_or_create(name='Test Section', slug='test-section')

        data = {
            'headline': 'Test headline',
            'section_id': section.id,
            'author_ids': [{'person': person1.id, 'type': 'author'},
                            {'person': person2.id, 'type': 'photographer'},
                            {'person': person3.id, 'type': 'illustrator'},
                            {'person': person4.id, 'type': 'videographer'}],
            'content': [],
            'slug': 'new-slug',
        }

        response = self.client.post(url, data, format='json')

        id = response.data['id']

        article = Article.objects.get(id=id)

        article_string = article.get_author_type_string()

        self.assertEqual(article_string, 'Written by <a href="/authors/test-person/">Test Person</a>, Photos by <a href="/authors/test-person-2/">Test Person 2</a>, Illustrations by <a href="/authors/test-person-3/">Test Person 3</a>, Videos by <a href="/authors/test-person-4/">Test Person 4</a>')

    def test_author_person(self):
        """Should not be able to create article with an author type and missing author person"""

        (section, created) = Section.objects.get_or_create(name='Test Section', slug='test-section')

        url = reverse('api-articles-list')

        data = {
            'headline': 'Test headline',
            'section_id': section.id,
            'author_ids': [{'type': 'author'}],
            'content': [],
            'slug': 'new-slug'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_author_type(self):
        """Should be able to create article with an author and missing author type"""

        (person, created) = Person.objects.get_or_create(full_name='Test Person', slug='test-person')
        (section, created) = Section.objects.get_or_create(name='Test Section', slug='test-section')

        data = {
            'headline': 'Test headline',
            'section_id': section.id,
            'author_ids': [{'person': 1}],
            'content': [],
            'slug': 'new-slug'
        }

        url = reverse('api-articles-list')

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_author_type_format(self):
        """Should not be able to create article with an author and non-string author type"""

        (person, created) = Person.objects.get_or_create(full_name='Test Person', slug='test-person')
        (section, created) = Section.objects.get_or_create(name='Test Section', slug='test-section')

        data = {
            'headline': 'Test headline',
            'section_id': section.id,
            'author_ids': [{'person': person.id, 'type': 0}],
            'content': [],
            'slug': 'new-slug'
        }

        url = reverse('api-articles-list')

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data['author_ids'][0]['type'] = 'article author'
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_article_tags(self):
        """Should be able to update and remove article tags"""

        article = DispatchTestHelpers.create_article(self.client)

        tag_1 = DispatchTestHelpers.create_tag(self.client, 'Tag 1')
        tag_2 = DispatchTestHelpers.create_tag(self.client, 'Tag 2')
        tag_3 = DispatchTestHelpers.create_tag(self.client, 'Tag 3')

        data = {
            'tag_ids': [tag_1.data['id'], tag_2.data['id']]
        }

        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['tags']), 2)
        self.assertEqual(response.data['tags'][0]['id'], tag_1.data['id'])
        self.assertEqual(response.data['tags'][1]['id'], tag_2.data['id'])

        data = {
            'tag_ids': [tag_1.data['id'], tag_3.data['id']]
        }

        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.patch(url, data, format='json')

        self.assertEqual(len(response.data['tags']), 2)
        self.assertEqual(response.data['tags'][0]['id'], tag_1.data['id'])
        self.assertEqual(response.data['tags'][1]['id'], tag_3.data['id'])

        data = {
            'tag_ids': []
        }

        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['tags'], [])

    def test_update_article_topic(self):
        """Should be able to update and remove the article topic"""

        article = DispatchTestHelpers.create_article(self.client)

        topic_1 = DispatchTestHelpers.create_topic(self.client, 'Topic 1')
        topic_2 = DispatchTestHelpers.create_topic(self.client, 'Topic 2')

        data = {
            'topic_id': topic_1.data['id']
        }

        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['topic']['id'], topic_1.data['id'])

        data = {
            'topic_id': topic_2.data['id']
        }

        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['topic']['id'], topic_2.data['id'])

        data = {
            'topic_id': None
        }

        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['topic'], None)

    def test_update_article_content(self):
        """Should be able to update the article content with different embeds."""

        article = DispatchTestHelpers.create_article(self.client)

        # Set empty content
        data = {
            'content': []
        }

        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'], [])

        # Set paragraph content
        data = {
            'content': [
                {
                    'type': 'paragraph',
                    'data': 'This is a test paragraph 1.'
                },
                {
                    'type': 'paragraph',
                    'data': 'This is a test paragraph 2.'
                }
            ]
        }

        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'][0]['data'], 'This is a test paragraph 1.')
        self.assertEqual(response.data['content'][1]['data'], 'This is a test paragraph 2.')

        # Set embeds content

        image = DispatchTestHelpers.create_image(self.client)
        (gallery, image_1, image_2) = DispatchTestHelpers.create_gallery(1, self.client)

        data = {
            'content': [
                {
                    'type': 'paragraph',
                    'data': 'This is a test paragraph 1.'
                },
                {
                    'type': 'image',
                    'data': {
                        'image_id': image.data['id']
                    }
                },
                {
                    'type': 'paragraph',
                    'data': 'This is a test paragraph 2.'
                },
                {
                    'type': 'gallery',
                    'data': {
                        'id': gallery.data['id']
                    }
                }
            ]
        }

        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'][0]['data'], 'This is a test paragraph 1.')
        self.assertEqual(response.data['content'][1]['data']['image']['id'], image.data['id'])
        self.assertEqual(response.data['content'][2]['data'], 'This is a test paragraph 2.')
        self.assertEqual(response.data['content'][3]['data']['gallery']['id'], gallery.data['id'])

    def test_delete_article_unauthorized(self):
        """Delete article should fail with unauthenticated request"""

        # Create an article
        article = DispatchTestHelpers.create_article(self.client)

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-articles-detail', args=[article.data['id']])

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_article(self):
        """Ensure that article can be deleted"""

        article = DispatchTestHelpers.create_article(self.client)

        # Generate detail URL
        url = reverse('api-articles-detail', args=[article.data['id']])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Can't delete an article that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_article_multiple_versions(self):
        """Ensure that deleting an article deletes all versions of the article"""

        article = DispatchTestHelpers.create_article(self.client)

        # Update the article to create a new version
        data = {
            'content': []
        }

        url = reverse('api-articles-detail', args=[article.data['id']])
        response = self.client.patch(url, data, format='json')

        # Delete the article
        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Article.objects.filter(parent__id=article.data['id']).exists())

    def test_publish_article(self):
        """Ensure that an existing article can be published"""

        article = DispatchTestHelpers.create_article(self.client)

        # Generate detail URL
        url = reverse('api-articles-publish', args=[article.data['id']])

        response = self.client.post(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['is_published'], True)

        # Get published_at in datetime format
        date_format = "%Y-%m-%dT%H:%M:%S.%f"
        article_published_at = datetime.datetime.strptime(response.data['published_at'], date_format)
        ten_min_ago = timezone.now() - datetime.timedelta(minutes=10)
        # Check it was published in correct timezone
        # aka within the last 10 min
        self.assertTrue(ten_min_ago < article_published_at)
        self.assertTrue(article_published_at < timezone.now())

    def test_unpublish_article(self):
        """Ensure that an existing article can be unpublished"""

        article = DispatchTestHelpers.create_article(self.client)

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
        """Ensure that an older version of an article can be unpublished"""

        article = DispatchTestHelpers.create_article(self.client)

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
        """Ensure that a specific version of an article can be published"""

        article = DispatchTestHelpers.create_article(self.client)

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
        """Ensure that an older version of an article can be published"""

        article = DispatchTestHelpers.create_article(self.client)

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
        """Publish article should fail with unauthorized request"""

        article = DispatchTestHelpers.create_article(self.client)

        # Clear authentication credentials
        self.client.credentials()

        url = reverse('api-articles-publish', args=[article.data['id']])
        response = self.client.post(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        articles = Article.objects.filter(parent_id=article.data['id'], is_published=True)

        self.assertEqual(len(articles), 0)

    def test_list_published_articles(self):
        """Unpublished articles should not be displayed to unauthorized users"""

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
    def test_article_exclude_query(self):
        """Should be able to exclude fields from articles by query params"""

        article_1 = DispatchTestHelpers.create_article(self.client, headline='Article 1', slug='article-1')
        article_2 = DispatchTestHelpers.create_article(self.client, headline='Article 2', slug='article-2')

        url = '%s?exclude=%s' % (reverse('api-articles-list'), 'content,section_id')
        response = self.client.get(url, format='json')

        data = response.data

        self.assertNotIn('content', data['results'][0])
        self.assertNotIn('section_id', data['results'][0])
        self.assertIn('slug', data['results'][0])
        self.assertNotIn('content', data['results'][1])
        self.assertNotIn('section_id', data['results'][1])
        self.assertIn('slug', data['results'][1])
        self.assertEqual(data['count'], 2)


    def test_article_headline_query(self):
        """Should be able to search for articles by headline"""

        article_1 = DispatchTestHelpers.create_article(self.client, headline='Article 1', slug='article-1')
        article_2 = DispatchTestHelpers.create_article(self.client, headline='Article 1 and 2', slug='article-2')
        article_3 = DispatchTestHelpers.create_article(self.client, headline='Article 3', slug='article-3')

        url = '%s?q=%s' % (reverse('api-articles-list'), 'Article 1')
        response = self.client.get(url, format='json')

        data = response.data

        self.assertEqual(data['results'][0]['headline'], 'Article 1 and 2')
        self.assertEqual(data['results'][1]['headline'], 'Article 1')
        self.assertEqual(data['count'], 2)

    def test_section_name_query(self):
        """Should be able to search for articles by section name"""

        article_1 = DispatchTestHelpers.create_article(self.client, headline='Article 1', slug='article-1')
        article_2 = DispatchTestHelpers.create_article(self.client, headline='Article 2', slug='article-2')

        section = Section.objects.create(name='Test section 2', slug='test-section-2')
        article_3 = DispatchTestHelpers.create_article(self.client, 'Article 3', 'article-3', section.name, section.slug)

        section_id =  article_1.data['section']['id']

        url = '%s?section=%s' % (reverse('api-articles-list'), section_id)
        response = self.client.get(url, format='json')

        data = response.data

        self.assertEqual(data['results'][0]['headline'], 'Article 2')
        self.assertEqual(data['results'][1]['headline'], 'Article 1')
        self.assertEqual(data['count'], 2)

    def test_author_name_query(self):
        """Should be able to search for articles by author name"""

        article_1 = DispatchTestHelpers.create_article(self.client, headline='Article 1', slug='article-1')
        article_2 = DispatchTestHelpers.create_article(self.client, headline='Article 2', slug='article-2')

        article_3 = DispatchTestHelpers.create_article(self.client, headline='Article 3', slug='article-3', author_names=['Test Person2'])

        author_id = article_1.data['authors'][0]['person']['id']

        url = '%s?author=%s' % (reverse('api-articles-list'), author_id)
        response = self.client.get(url, format='json')

        data = response.data

        self.assertEqual(data['results'][0]['headline'], 'Article 2')
        self.assertEqual(data['results'][1]['headline'], 'Article 1')
        self.assertEqual(data['count'], 2)

    def test_author_query_multiple_authors(self):
        """Should be able to search for articles with multiple authors by one author's name"""

        article_1 = DispatchTestHelpers.create_article(self.client, headline='Article 1', slug='article-1')
        article_2 = DispatchTestHelpers.create_article(self.client, headline='Article 2', slug='article-2')

        article_3 = DispatchTestHelpers.create_article(self.client, headline='Article 3', slug='article-3', author_names=['The Test Person', 'Test Person2'])

        article_4 = DispatchTestHelpers.create_article(self.client, headline='Article 4', slug='article-2', author_names=['Test Person2'])

        author_id = article_1.data['authors'][0]['person']['id']

        url = '%s?author=%s' % (reverse('api-articles-list'), author_id)
        response = self.client.get(url, format='json')

        data = response.data

        self.assertEqual(data['results'][0]['headline'], 'Article 3')
        self.assertEqual(data['results'][1]['headline'], 'Article 2')
        self.assertEqual(data['results'][2]['headline'], 'Article 1')
        self.assertEqual(data['count'], 3)

    def test_set_featured_image(self):
        """Ensure that a featured image can be set"""

        article = DispatchTestHelpers.create_article(self.client)
        image = DispatchTestHelpers.create_image(self.client)

        data = {
            'featured_image':   {
                'image_id': image.data['id']
            }
        }

        url = reverse('api-articles-detail', args=[article.data['id']])

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.data['featured_image']['image']['id'], image.data['id'])

    def test_set_featured_image_no_id(self):
        """Ensure that there must have an image_id in order to set a featured image"""

        article = DispatchTestHelpers.create_article(self.client)

        data = {
            'featured_image':   {
                'image_id': None,
                'credit': 'test credit',
                'caption': 'test caption'
            }
        }

        url = reverse('api-articles-detail', args=[article.data['id']])

        response = self.client.patch(url, data, format='json')

        data = {
            'featured_image': None
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.data['featured_image'], None)

    def test_remove_featured_image(self):
        """Ensure that a featured image can be removed"""

        article = DispatchTestHelpers.create_article(self.client)
        image = DispatchTestHelpers.create_image(self.client)
        
        data = {
            'featured_image':   {
                'image_id': image.data['id']
            }
        }

        url = reverse('api-articles-detail', args=[article.data['id']])

        response = self.client.patch(url, data, format='json')

        data = {
            'featured_image': None
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.data['featured_image'], None)

    def test_set_featured_video(self):
        """Ensure that a featured video can be set"""

        article = DispatchTestHelpers.create_article(self.client)

        url = reverse('api-videos-list')

        video = DispatchTestHelpers.create_video(self.client, 'testVideo')

        data = {
            'featured_video':   {
                'video_id': video.data['id']
            }
        }

        url = reverse('api-articles-detail', args=[article.data['id']])

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.data['featured_video']['video']['id'], video.data['id'])

    def test_set_featured_video_no_id(self):
        """Ensure that there must have a video_id in order to set a featured video"""

        article = DispatchTestHelpers.create_article(self.client)

        url = reverse('api-videos-list')

        video = DispatchTestHelpers.create_video(self.client, 'testVideo')

        data = {
            'featured_video':   {
                'video_id': None,
                'credit': 'test credit',
                'caption': 'test caption'
            }
        }

        url = reverse('api-articles-detail', args=[article.data['id']])

        response = self.client.patch(url, data, format='json')

        data = {
            'featured_video': None
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.data['featured_video'], None)

    def test_remove_featured_video(self):
        """Ensure that a featured video can be removed"""

        article = DispatchTestHelpers.create_article(self.client)

        url = reverse('api-videos-list')

        video = DispatchTestHelpers.create_video(self.client, 'testVideo')

        data = {
            'featured_video':   {
                'video_id': video.data['id']
            }
        }

        url = reverse('api-articles-detail', args=[article.data['id']])

        response = self.client.patch(url, data, format='json')

        data = {
            'featured_video': None
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.data['featured_video'], None)

from rest_framework import status

from django.core.urlresolvers import reverse

from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.models import Page

class PagesTest(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_create_page_unauthorized(self):
        """Create page while unauthorized should fail with unauthenticated request"""

        # Clear authentication credentials
        self.client.credentials()

        response = DispatchTestHelpers.create_page(self.client)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_empty_page(self):
        """Create page should fail with empty payload"""

        url = reverse('api-pages-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_incomplete_page(self):
        """Create page should fail with missing required fields"""

        url = reverse('api-pages-list')

        # Page missing content, snippet, slug
        data = {
            'title': 'Test Page'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        count = Page.objects.all().count()

        self.assertEqual(count, 0)


    def test_create_page(self):
        """Ensure we can make a page"""

        response = DispatchTestHelpers.create_page(self.client)

        id = response.data['id']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        try:
            page = Page.objects.get(pk=response.data['id'])
        except Page.DoesNotExist:
            self.fail('The page should exist in the database')

        # Check Data
        self.assertEqual(response.data['title'], 'Test Page')
        self.assertEqual(response.data['slug'], 'test-page')
        self.assertEqual(response.data['snippet'], 'This is a test snippet')
        self.assertEqual(response.data['content'][0]['type'], 'paragraph')
        self.assertEqual(response.data['content'][0]['data'], 'This is some paragraph text')

        try:
            page = Page.objects.get(pk=response.data['id'])
        except Page.DoesNotExist:
            self.fail("The page should exist in the database")

        self.assertEqual(page.title, 'Test Page')
        self.assertEqual(page.slug, 'test-page')
        self.assertEqual(page.snippet, 'This is a test snippet')
        self.assertEqual(page.content[0]['type'], 'paragraph')
        self.assertEqual(page.content[0]['data'], 'This is some paragraph text')

    def test_update_fields_page(self):
        """Should be able to update the title, slug, snippet of the page"""

        page = DispatchTestHelpers.create_page(self.client)

        url = reverse('api-pages-detail', args=[page.data['id']])

        data = {
          'title': 'New Test Page',
          'slug': 'new-test-page',
          'snippet': 'This is a new test snippet'
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check data
        self.assertEqual(response.data['title'], 'New Test Page')
        self.assertEqual(response.data['slug'], 'new-test-page')
        self.assertEqual(response.data['snippet'], 'This is a new test snippet')

        old_page = Page.objects.get(parent_id=response.data['id'], revision_id=1)

        self.assertEqual(old_page.title, 'Test Page')
        self.assertEqual(old_page.slug, 'test-page')
        self.assertEqual(old_page.snippet, 'This is a test snippet')
        self.assertEqual(old_page.revision_id, 1)

        new_page = Page.objects.get(parent_id=response.data['id'], head=True)

        self.assertEqual(new_page.title, 'New Test Page')
        self.assertEqual(new_page.slug, 'new-test-page')
        self.assertEqual(new_page.snippet, 'This is a new test snippet')
        self.assertEqual(new_page.revision_id, 2)

    def test_update_content_page(self):
        """Should be able to update contents of the page"""

        page = DispatchTestHelpers.create_page(self.client)

        url = reverse('api-pages-detail', args=[page.data['id']])

        data = {
          'content': [
            {
              'type': 'paragraph',
              'data': 'This is some brand new paragraph text'
            }
          ]
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.data['content'][0]['data'], 'This is some brand new paragraph text')

        page = Page.objects.get(parent_id=page.data['id'], head=True)

        self.assertEqual(page.content[0]['data'], 'This is some brand new paragraph text')

    def test_update_content_unauthorized(self):
        """Patch page should fail with unauthenticated request"""

        response = DispatchTestHelpers.create_page(self.client)

        page_id = response.data['id']

        url = reverse('api-pages-detail', args=[page_id])

        self.client.credentials()

        data = {
          'content': [
            {
              'type': 'paragraph',
              'data': 'This is some new paragraph text'
            }
          ]
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        old_page = Page.objects.get(pk=page_id)

        self.assertEqual(old_page.content[0]['data'], 'This is some paragraph text')

        try:
            new_page = Page.objects.get(parent_id=page_id, head=True)
            self.fail('A new version of the page should not exist')
        except:
            pass

    def test_delete_page_unauthorized(self):
        """Delete page should fail with unauthenticated request"""

        page = DispatchTestHelpers.create_page(self.client)

        self.client.credentials()

        url = reverse('api-pages-detail', args=[page.data['id']])

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        try:
            page = Page.objects.get(pk=page.data['id'])
        except Page.DoesNotExist:
            self.fail('The page should not have been deleted')

    def test_delete_page(self):
        """Ensure that you can delete your page"""

        page = DispatchTestHelpers.create_page(self.client)

        url = reverse('api-pages-detail', args=[page.data['id']])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Can't delete a page that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_pages_search(self):
        """Should be able to search through pages"""

        page_1 = DispatchTestHelpers.create_page(self.client, 'page 1', 'page-1')
        page_2 = DispatchTestHelpers.create_page(self.client, 'page 1 and 2', 'page-2')
        page_3 = DispatchTestHelpers.create_page(self.client, 'page 3', 'page-3')

        url = '%s?q=%s' % (reverse('api-pages-list'), 'page 1')

        response = self.client.get(url, format='json')

        data = response.data

        self.assertEqual(data['results'][0]['title'], 'page 1 and 2')
        self.assertEqual(data['results'][1]['title'], 'page 1')
        self.assertEqual(data['count'], 2)

    def test_set_featured_image(self):
        """Ensure that a featured image can be set"""

        page = DispatchTestHelpers.create_page(self.client)
        
        url = reverse('api-images-list')
        
        image_file = 'test_image_a.jpg'

        with open(self.get_input_file(image_file)) as test_image:
            image = self.client.post(url, { 'img': test_image }, format='multipart')

        data = {
            'featured_image':   {
                'image_id': image.data['id']
            }
        }

        url = reverse('api-pages-detail', args=[page.data['id']])

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.data['featured_image']['image']['id'], image.data['id'])

    def test_remove_featured_image(self):
        """Ensure that a featured image can be removed"""

        page = DispatchTestHelpers.create_page(self.client)
        
        url = reverse('api-images-list')
        
        image_file = 'test_image_a.jpg'

        with open(self.get_input_file(image_file)) as test_image:
            image = self.client.post(url, { 'img': test_image }, format='multipart')

        data = {
            'featured_image':   {
                'image_id': image.data['id']
            }
        }

        url = reverse('api-pages-detail', args=[page.data['id']])

        response = self.client.patch(url, data, format='json')

        data = {
            'featured_image': None
        }

        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.data['featured_image'], None)

    def test_set_featured_video(self):
        """Ensure that a featured video can be set"""

        page = DispatchTestHelpers.create_page(self.client)
        
        url = reverse('api-videos-list')

        video = DispatchTestHelpers.create_video(self.client, 'testVideo')

        data = {
            'featured_video':   {
                'video_id': video.data['id']
            }
        }

        url = reverse('api-pages-detail', args=[page.data['id']])

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.data['featured_video']['video']['id'], video.data['id'])

    def test_remove_featured_video(self):
        """Ensure that a featured video can be removed"""

        page = DispatchTestHelpers.create_page(self.client)
        
        url = reverse('api-videos-list')
        
        video = DispatchTestHelpers.create_video(self.client, 'testVideo')

        data = {
            'featured_video':   {
                'video_id': video.data['id']
            }
        }

        url = reverse('api-pages-detail', args=[page.data['id']])

        response = self.client.patch(url, data, format='json')

        data = {
            'featured_video': None
        }

        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.data['featured_video'], None)
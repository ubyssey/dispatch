from django.core.urlresolvers import reverse

from rest_framework import status

from dispatch.tests.cases import DispatchAPITestCase

from dispatch.apps.content.models import Page

class PagesTest(DispatchAPITestCase):

    def _create_page(self):

        """
        Create Dummy Page
        """

        url = reverse('api-pages-list')

        data = {
          "title": "Test Page",
          "slug": "test-page",
          "snippet": "This is a test snippet",
          "content": [
            {
              "type": "paragraph",
              "data": "This is some paragraph text"
            }
          ]
        }

        return self.client.post(url, data, format='json')

    def test_create_page_unauthorized(self):
        """
        Create page while unauthorized should fail with unauthenticated request
        """
        # Clear authentication credentials
        self.client.credentials()

        response = self._create_page()

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_empty_page(self):
        """
        Create page should fail with empty payload
        """

        url = reverse('api-pages-list')

        response = self.client.post(url, None, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_incomplete_page(self):
        """
        Creat Page should fail with missing required fields
        """

        url = reverse('api-pages-list')

        # Page missing content, snippet, slug
        data = {
            "title": "Test Page"
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        count = Page.objects.all().count()

        self.assertEqual(count, 0)


    def test_create_page(self):
        """
        Ensure we can make a page
        """

        response = self._create_page()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check Data
        self.assertEqual(response.data['title'], 'Test Page')
        self.assertEqual(response.data['slug'], 'test-page')
        self.assertEqual(response.data['snippet'], "This is a test snippet")
        self.assertEqual(response.data['content'][0]['type'], 'paragraph')
        self.assertEqual(response.data['content'][0]['data'], 'This is some paragraph text')

    def test_update_fields_page(self):
        """
        Should be able to update the title, slug, snippet of the page
        """

        # First make a page
        response = self._create_page()

        # Generate detail url
        url = reverse('api-pages-detail', args=[response.data['id']])

        # Change the fields
        new_data = {
          "title": "New Test Page",
          "slug": "new-test-page",
          "snippet": "This is a new test snippet",
        }

        response = self.client.patch(url, new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check data
        self.assertEqual(response.data['title'], "New Test Page")
        self.assertEqual(response.data['slug'], "new-test-page")
        self.assertEqual(response.data['snippet'], "This is a new test snippet")

    def test_update_content_page(self):
        """
        Should be able to update contents of the page
        """

        # First make a page
        page = self._create_page()

        # Generate detail url
        url = reverse('api-pages-detail', args=[page.data['id']])

        # Change the content
        new_data = {
          "content": [
            {
              "type": "paragraph",
              "data": "This is some brand new paragraph text"
            }
          ]
        }

        response = self.client.patch(url, new_data, format='json')

        self.assertEqual(response.data['content'][0]['data'], "This is some brand new paragraph text")

    def test_update_content_unauthorized(self):
        """
        Patch page should fail with unauthenticated request
        """

        # First make a page
        response = self._create_page()

        id = response.data['id']

        # Generate detail url
        url = reverse('api-pages-detail', args=[id])

        self.client.credentials()

        # Change the fields
        new_data = {
          "content": [
            {
              "type": "paragraph",
              "data": "This is some new paragraph text"
            }
          ]
        }

        response = self.client.patch(url, new_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        page = Page.objects.get(pk=id)

        self.assertEqual(page.content[0]['data'], 'This is some paragraph text')


    def test_delete_page_unauthorized(self):
        """
        Delete page should fail with unauthenticated request
        """

        # Create an page
        page = self._create_page()

        # Clear the client's credentials
        self.client.credentials()

        # Generate detail URL
        url = reverse('api-pages-detail', args=[page.data['id']])

        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_page(self):
        """
        Ensure that you can delete your page
        """

        page = self._create_page()

        # Generate detail url
        url = reverse('api-pages-detail', args=[page.data['id']])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Can't delete a page that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

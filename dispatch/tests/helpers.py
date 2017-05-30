from django.core.urlresolvers import reverse

from rest_framework import status

from dispatch.apps.content.models import Article, Person, Section, Event
from dispatch.tests.cases import DispatchMediaTestMixin

class DispatchTestHelpers(object):

    @classmethod
    def create_article(cls, client, headline='Test headline', slug='test-article', section='Test Section', slug_section = 'test_section_slug'):
        """Create a dummy article instance"""

        # Create test person
        person = Person.objects.create(full_name='Test Person')

        # Create test section
        (section, created) = Section.objects.get_or_create(name=section, slug=slug_section)

        url = reverse('api-articles-list')

        data = {
            'headline': headline,
            'section_id': section.id,
            'author_ids': [person.id],
            'slug': slug,
            'content': []
        }

        return client.post(url, data, format='json')

    @classmethod
    def upload_file(cls, client):
        """Upload a test file to server"""

        obj = DispatchMediaTestMixin()

        url = reverse('api-files-list')

        with open(obj.get_input_file('test_file.txt')) as test_file:

            data = {
                'name': 'TestFile',
                'file': test_file
            }

            response = client.post(url, data, format='multipart')

        return response

    @classmethod
    def upload_image(cls, client):
        """Upload an image that can be linked by galleries"""

        url = reverse('api-images-list')

        obj = DispatchMediaTestMixin()

        with open(obj.get_input_file('test_image.png'), 'rb') as test_image:
            response = client.post(url, { 'img': test_image }, format='multipart')

        return response.data['id']

    @classmethod
    def _create_gallery_only(cls, id, attachments, client):
        """Creates a gallery instance, but does not upload images"""

        url = reverse('api-galleries-list')

        data = {
          'title': 'Gallery Title %d' % id,
          'attachment_json': attachments
        }

        return client.post(url, data, format='json')

    @classmethod
    def create_gallery(cls, id, client):
        """Create a gallery instance for further testing"""

        image_1 = cls.upload_image(client)
        image_2 = cls.upload_image(client)

        attachment = [
            {
                'caption': 'test caption 1',
                'image_id': image_1
            },
            {
                'caption': 'test caption 2',
                'image_id': image_2
            }
        ]

        return (cls._create_gallery_only(id, attachment, client), image_1, image_2)

    @classmethod
    def create_page(cls, client, title='Test Page', slug='test-page'):
        """Create dummy page"""

        url = reverse('api-pages-list')

        data = {
          'title': title,
          'slug': slug,
          'snippet': 'This is a test snippet',
          'content': [
            {
              'type': 'paragraph',
              'data': 'This is some paragraph text'
            }
          ]
        }

        return client.post(url, data, format='json')

    @classmethod
    def create_section(cls, client, name='Test Section', slug='test-section'):
        """Create a dummy section instance"""

        data = {
            'name': name,
            'slug': slug
        }

        url = reverse('api-sections-list')

        return client.post(url, data, format='json')

    @classmethod
    def create_person(cls, client, full_name='', image='', slug='', description=''):
        """A helper method that creates a simple person object with the given attributes
        and returns the response"""

        url = reverse('api-persons-list')

        data = {
            'full_name': full_name,
            'image': image,
            'slug': slug,
            "description": description
        }

        return client.post(url, data, format='multipart')
    
    @classmethod
    def create_user(cls, client, email, full_name='Attached Person', person_id=None):
        """
        A helper method that creates a simple user object with the given attributes
        and returns the response
        """

        person_id = person_id or cls.create_person(client, full_name).data['id']
        url = reverse('api-users-list')
        data = {
            'email' : email,
            'person_id' : person_id,
            'password_a': 'TheBestPassword',
            'password_b': 'TheBestPassword'
        }

        return client.post(url, data, format='json')
    @classmethod
    def create_tag(cls, client, name='testTag'):
        """Create a dummy tag instance"""

        data = {
            'name': name
        }

        url = reverse('api-tags-list')

        return client.post(url, data, format='json')

    @classmethod
    def create_topic(cls, client, name='Test Topic'):
        """Create a dummy topic instance"""

        data = {
            'name': name
        }

        url = reverse('api-topics-list')

        return client.post(url, data, format='json')

    @classmethod
    def create_event(cls, client, title='Test event', description='Test description', host='test host'):

        data = {
            'title': title,
            'description': description,
            'host': host
        }

        url = reverse('api-event-list')

        return client.post(url, data, format='json')

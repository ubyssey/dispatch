from django.urls import reverse
from random import randint

from rest_framework import status

from dispatch.models import Article, Author, Person, Section, Image
from dispatch.tests.cases import DispatchMediaTestMixin
from dispatch.modules.content.mixins import AuthorMixin
import json

class DispatchTestHelpers(object):

    @classmethod
    def create_article(cls, client, headline='Test headline', slug='test-article', section='Test Section', slug_section = 'test_section_slug', author_names = ['The Test Person'], subsection_id=None):
        """Create a dummy article instance"""

        # Create test person
        authors = []

        for author in author_names:
            (person, created) = Person.objects.get_or_create(full_name=author, slug=author)
            authors.append({
                'person': person.id,
                'type': 'author'
            })

        # Create test section
        (section, created) = Section.objects.get_or_create(name=section, slug=slug_section)

        url = reverse('api-articles-list')

        data = {
            'headline': headline,
            'section_id': section.id,
            'author_ids': authors,
            'slug': slug,
            'content': []
        }

        return client.post(url, data, format='json')

    @classmethod
    def create_subsection(cls, client, name='Test subsection', slug='test-subsection', section='Test Section', slug_section = 'test_section_slug', author_names = ['Test Person'], article_headlines = ['Test headline']):
        """Create a dummy subsection instance"""
        # Create test person
        authors = []

        for author in author_names:
            (person, created) = Person.objects.get_or_create(full_name=author, slug=author.lower().replace(' ', '-'))
            authors.append({
                'person': person.id,
                'type': 'author'
            })

        articles = []
        # Create test section
        (section, created) = Section.objects.get_or_create(name=section, slug=slug_section)

        for headline in article_headlines:
            (article, created) = Article.objects.get_or_create(headline=headline, section=section, slug=headline)
            articles.append(article.id)


        url = reverse('api-subsections-list')

        data = {
            'name': name,
            'slug': slug,
            'section_id': section.id,
            'author_ids': authors,
            'article_ids': articles
        }

        return client.post(url, data, format='json')

    @classmethod
    def upload_file(cls, client, filename='TestFile'):
        """Upload a test file to server"""

        obj = DispatchMediaTestMixin()

        url = reverse('api-files-list')

        with open(obj.get_input_file('test_file.txt')) as test_file:

            data = {
                'name': filename,
                'file': test_file
            }

            response = client.post(url, data, format='multipart')

        return response

    @classmethod
    def create_image(cls, client, filename='test_image_a.png', author_names=['Test Person']):
        """Upload an image that can be linked by galleries"""

        # Create test person
        authors = []

        for author in author_names:
            (person, created) = Person.objects.get_or_create(full_name=author, slug=author.lower().replace(' ', '-'))
            authors.append({
                'person': person.id,
                'type': 'photographer'
            })

        obj = DispatchMediaTestMixin()

        url = reverse('api-images-list')

        with open(obj.get_input_file(filename), 'rb') as test_image:
            response = client.post(url, { 'img': test_image, 'authors': json.dumps(authors), 'author_ids': json.dumps(authors) }, format='multipart')

        return response

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

        image_1 = cls.create_image(client)
        image_2 = cls.create_image(client)

        attachment = [
            {
                'caption': 'test caption 1',
                'credit': 'test credit 1',
                'image_id': image_1.data['id']
            },
            {
                'caption': 'test caption 2',
                'credit': 'test credit 2',
                'image_id': image_2.data['id']
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
    def create_person(cls, client, full_name=('Person' + str(randint(0,1000000))), slug=('person' + str(randint(0,1000000))), image='', description='', title=''):
        """A helper method that creates a simple person object with the given attributes
        and returns the response"""

        url = reverse('api-persons-list')

        data = {
            'full_name': full_name,
            'slug': slug,
            'image': image,
            'description': description,
            'title': title
        }

        return client.post(url, data, format='multipart')

    @classmethod
    def create_user(cls, client, email, full_name=('Attached Person' + str(randint(0,1000000))), person=None, slug=('attached-person' + str(randint(0,1000000))), password='TheBestPassword', permissions=None):
        """
        A helper method that creates a simple user object with the given attributes
        and returns the response
        """

        person = person or cls.create_person(client, full_name=full_name, slug=slug).data['id']
        url = reverse('api-users-list')
        data = {
            'email' : email,
            'person' : person,
            'password_a': password,
            'password_b': password,
            'permission_level': permissions
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
    def create_video(cls, client, title='testVideo', url='testVideoURL'):
        """Create a dummy video instance"""
        (person, created) = Person.objects.get_or_create(full_name='Test Person', slug='test-person')

        data = {
            'title': title,
            'url': url,
            'author_ids': [
                {
                'person': person.id,
                'type': 'author'
                }
            ]
        }

        url = reverse('api-videos-list')

        return client.post(url, data, format='json')

    @classmethod
    def create_tricky_video(cls, client, title='testVideo', url='testVideoURL'):
        """Create a video instance where the authors are on the second page"""
        for i in range(20):
            (person, created) = Person.objects.get_or_create(full_name='Test Person' + str(i), slug='test-person' + str(i))
            (person2, created2) = Person.objects.get_or_create(full_name='Test Person' + str(i + 1), slug='test-person' + str(i + 1))
            
        data = {
            'title': title,
            'url': url,
            'author_ids': [
                {
                'person': person.id,
                'type': 'author'
                },
                {
                'person': person2.id,
                'type': 'videographer'
                }
            ]
        }

        url = reverse('api-videos-list')

        return client.post(url, data, format='json')

    @classmethod
    def update_video(cls, client, videoId=None, updatedProperty='title', value='updatedTitle'):
        """Update a dummy video instance with a specific id"""
        data = {}
        
        if updatedProperty == 'author_ids':
            (person, created) = Person.objects.get_or_create(full_name='Test Person', slug='test-person')
            (person2, created2) = Person.objects.get_or_create(full_name='Test Person 2', slug='test-person-2')
            (person3, created3) = Person.objects.get_or_create(full_name='Test Person 3', slug='test-person-3')
            value = [
                {
                'person': person.id,
                'type': 'author'
                },
                {
                'person': person2.id,
                'type': 'videographer'
                },
                {
                'person': person3.id,
                'type': 'videographer'
                }
            ]
        
        data[updatedProperty] = value

        url = reverse('api-videos-detail', args=[videoId])

        return client.patch(url, data, format='json')

    @classmethod
    def create_invite(cls, client, email, person=None, permissions=''):
        """Create dummy invite instance"""

        if person is None:
            person = cls.create_person(client, full_name='Invited person', slug='invited-person')

        url = reverse('api-invites-list')

        data = {
            'email': email,
            'permissions': permissions,
            'person': person.data['id']
        }

        return client.post(url, data, format='json')

    @classmethod
    def create_poll(cls, client, name='test name', question='test question', answers=[{'id':1,'name':'answer1'},{'id':2,'name':'answer2'}], is_open=True, show_results=True):
        """Create a dummy poll instance"""

        data = {
            'name': name,
            'question': question,
            'answers_json': answers,
            'is_open': is_open,
            'show_results': show_results
        }

        url = reverse('api-polls-list')

        return client.post(url, data, format='json')

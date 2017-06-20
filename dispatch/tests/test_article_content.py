from django.test import TestCase

from dispatch.apps.content.models import Article, Section

from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers

class ArticleContentTests(DispatchAPITestCase, DispatchMediaTestMixin):

    def setUp(self):
        super(ArticleContentTests, self).setUp()

        section = Section.objects.create(
            name='Test section',
            slug='test-section'
        )

        self.article = Article.objects.create(
            headline='Test article',
            section=section,
            slug='test-article'
        )

    def test_empty_content(self):
        """Should be able to render empty content"""

        self.article.content = []
        self.assertEqual(self.article.html, '')

    def test_paragraphs(self):
        """Should be able to render paragraph node"""

        self.article.content = [
            {
                'type': 'paragraph',
                'data': 'This is a test paragraph'
            },
            {
                'type': 'paragraph',
                'data': 'This is another test paragraph'
            }
        ]

        expected = '<p>This is a test paragraph</p><p>This is another test paragraph</p>'

        self.assertEqual(self.article.html, expected)

    def test_image(self):
        """Should be able to render image nodes"""

        image_1 = DispatchTestHelpers.create_image(self.client)
        image_2 = DispatchTestHelpers.create_image(self.client)

        self.article.content = [
            {
                'type': 'image',
                'data': {
                    'image_id': image_1.data['id'],
                    'caption': 'Test caption 1',
                    'credit': 'Test credit 1'
                }
            },
            {
                'type': 'paragraph',
                'data': 'This is a test paragraph'
            },
            {
                'type': 'image',
                'data': {
                    'image_id': image_2.data['id'],
                    'caption': 'Test caption 2',
                    'credit': 'Test credit 2'
                }
            }
        ]

        expected = '<div class="image-embed">\n    <img class="image" src="%s" alt="Test caption 1" />\n    <div class="caption">Test caption 1</div>\n    <div class="credit">Test credit 1</div>\n</div>\n<p>This is a test paragraph</p><div class="image-embed">\n    <img class="image" src="%s" alt="Test caption 2" />\n    <div class="caption">Test caption 2</div>\n    <div class="credit">Test credit 2</div>\n</div>\n'

        self.assertEqual(self.article.html, expected % (image_1.data['url'], image_2.data['url']))

    def test_image_gallery(self):
        """Should be able to render image gallery"""

        (gallery, image_1, image_2) = DispatchTestHelpers.create_gallery(1, self.client)

        self.article.content = [
            {
                'type': 'gallery',
                'data': {
                    'id': gallery.data['id'],
                    'caption': 'Test caption 1',
                    'credit': 'Test credit 1'
                }
            },
            {
                'type': 'paragraph',
                'data': 'This is a test paragraph'
            }
        ]

        expected = '<div class="gallery-attachment">\n    <div class="images">\n        \n        <img src="%s" />\n        \n        <img src="%s" />\n        \n    </div>\n</div>\n<p>This is a test paragraph</p>'

        self.assertEqual(self.article.html, expected % (image_1.data['url'], image_2.data['url']))

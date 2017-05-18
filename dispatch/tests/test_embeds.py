from django.template import loader
from django.core.urlresolvers import reverse

from dispatch.apps.frontend import embeds
from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.apps.content.models import ImageGallery

class EmbedsTest(DispatchAPITestCase, DispatchMediaTestMixin):

    def test_list_controller(self):
        """Should output correct html list formatting"""

        data_1 = [
            'item 1',
            'item 2',
            'item 3'
        ]

        data_2 = []

        result_1 = embeds.ListController.render(data_1)
        result_2 = embeds.ListController.render(data_2)

        self.assertEqual(result_1, '<ul><li>item 1</li><li>item 2</li><li>item 3</li></ul>')
        self.assertEqual(result_2, '<ul></ul>')

    def test_header_controller(self):
        """Should output correct header tags around content"""

        data_1 = {
            'size' : 'h1',
            'content' : 'Header text'
        }

        data_2 = {
            'size' : 'h4',
            'content' : 'Header text'
        }

        data_3 = {
            'size' : '',
            'content' : ''
        }

        result_1 = embeds.HeaderController.render(data_1)
        result_2 = embeds.HeaderController.render(data_2)
        result_3 = embeds.HeaderController.render(data_3)

        self.assertEqual(result_1, '<h1>Header text</h1>')
        self.assertEqual(result_2, '<h1>Header text</h1>')
        self.assertEqual(result_3, '<h1></h1>')

    def test_code_controller(self):
        """should output correct code tags around content"""

        data_1 = {
            'mode' : 'javascript',
            'content' : 'var test = 1;'
        }

        data_2 = {
            'mode' : 'css',
            'content' : 'body { color:red; }'
        }

        data_3 = {
            'mode' : 'html',
            'content' : '<b>test</b>'
        }

        data_4 = {
            'mode' : '',
            'content' : ''
        }

        result_1 = embeds.CodeController.render(data_1)
        result_2 = embeds.CodeController.render(data_2)
        result_3 = embeds.CodeController.render(data_3)
        result_4 = embeds.CodeController.render(data_4)

        self.assertEqual(result_1, '<script>var test = 1;</script>')
        self.assertEqual(result_2, '<style>body { color:red; }</style>')
        self.assertEqual(result_3, '<b>test</b>')
        self.assertEqual(result_4, '')

    def test_advertisement_controller(self):
        """Should output id of ad and alignment in html"""

        data_1 = {
            'id' : 'ad-1',
            'alignment' : 'right'
        }

        data_2 = {
            'id' : '',
            'alignment' : ''
        }

        result_1 = embeds.embedlib.render('advertisement', data_1)
        result_2 = embeds.embedlib.render('advertisement', data_2)

        self.assertEqual(result_1.strip(), '<div class="ad"><span>ad-1</span><span>right</span></div>')
        self.assertEqual(result_2.strip(), '<div class="ad"><span></span><span></span></div>')

    def test_pull_quote_controller(self):
        """Gives quote and source"""

        data_1 = {
            'content' : 'This is a quote',
            'source' : 'This is the source'
        }

        data_2 = {
            'content' : 'This is a quote'
        }

        data_3 = {
            'content' : ''
        }

        result_1 = embeds.embedlib.render('quote', data_1)
        result_2 = embeds.embedlib.render('quote', data_2)
        result_3 = embeds.embedlib.render('quote', data_3)

        self.assertEqual(result_1.strip(), '<p class="quote">This is a quote</p>\n  <p class="source">&mdash; This is the source</p>')
        self.assertEqual(result_2.strip(), '<p class="quote">This is a quote</p>')
        self.assertEqual(result_3.strip(), '<p class="quote"></p>')

    def test_video_controller(self):
        """Should output html strings with the information included"""

        data_1 = {
            'id' : '1234',
            'title' : 'Test title',
            'caption' : 'Test caption',
            'credit' : 'Test credit'
        }
        data_2 = {
            'id' : '1234',
            'title' : 'Test title',
            'caption' : 'Test caption',
        }
        data_3 = {
            'id' : '1234',
            'title' : 'Test title',
            'credit' : 'Test credit'
        }
        data_4 = {
            'id' : '1234',
            'title' : 'Test title',
        }
        data_5 = {
            'id' : '',
            'title' : ''
        }

        result_1 = embeds.embedlib.render('video', data_1)
        result_2 = embeds.embedlib.render('video', data_2)
        result_3 = embeds.embedlib.render('video', data_3)
        result_4 = embeds.embedlib.render('video', data_4)
        result_5 = embeds.embedlib.render('video', data_5)

        self.assertEqual(result_1.strip(), '<iframe src="https://www.youtube.com/watch?v=1234"></iframe>\n<h1>Test title</h1>\n<div class="caption">\n    Test caption <span class="credit">Test credit</span>\n</div>')
        self.assertEqual(result_2.strip(), '<iframe src="https://www.youtube.com/watch?v=1234"></iframe>\n<h1>Test title</h1>\n<div class="caption">\n    Test caption <span class="credit"></span>\n</div>')
        self.assertEqual(result_3.strip(), '<iframe src="https://www.youtube.com/watch?v=1234"></iframe>\n<h1>Test title</h1>\n<div class="caption">\n     <span class="credit">Test credit</span>\n</div>')
        self.assertEqual(result_4.strip(), '<iframe src="https://www.youtube.com/watch?v=1234"></iframe>\n<h1>Test title</h1>')
        self.assertEqual(result_5.strip(), '<iframe src="https://www.youtube.com/watch?v="></iframe>\n<h1></h1>')

    def test_not_in_embedlib(self):
        """Should raise EmbedException"""

        data = {
            'id' : '123'
        }

        try:
            result = embeds.embedlib.render('test', data)
            self.fail('EmbedDoesNotExist exception should have been raised')
        except embeds.EmbedException:
            pass

    def test_register_existing_type(self):
        """Should overwrite previous type"""

        data_1 = {
            'size' : 'h1',
            'content' : 'Header text'
        }

        embeds.embedlib.register('quote', embeds.HeaderController)

        result = embeds.embedlib.render('quote', data_1)

        self.assertEqual(result, '<h1>Header text</h1>')

    def test_image_controller_render(self):
        """Should output html string"""

        image_id = DispatchTestHelpers.upload_image(self.client)

        data = {
            'image_id' : image_id,
            'caption' : 'This is a test caption',
            'credit' : 'This is a test credit'
        }

        html_str = u'<div class="image-embed">\n    <img class="image" src="images/2017/05/test_image.png" alt="This is a test caption" />\n    <div class="caption">This is a test caption</div>\n    <div class="credit">This is a test credit</div>\n</div>\n'

        result = embeds.embedlib.render('image', data)

        self.assertEqual(result, html_str)

    def test_image_controller_to_json(self):
        """Should output json data"""

        url = reverse('api-images-list')

        with open(self.get_input_file('test_image.jpg')) as test_image:
            response = self.client.post(url, { 'img': test_image }, format='multipart')

        image_id = response.data['id']

        data = {
            'image_id' : image_id,
            'caption' : 'This is a test caption',
            'credit' : 'This is a test credit'
        }

        json = {
            'image': {
                'title': None,
                'url': u'images/2017/05/test_image.jpg',
                'url_medium': u'images/2017/05/test_image-medium.jpg',
                'created_at': response.data['created_at'],
                'updated_at': response.data['updated_at'],
                'url_thumb': u'images/2017/05/test_image-square.jpg',
                'filename': u'test_image.jpg',
                'width': 600,
                'authors': [],
                'height': 400,
                'id': 1
            },
            'caption': 'This is a test caption',
            'credit': 'This is a test credit'
        }

        result = embeds.embedlib.to_json('image', data)

        self.assertEqual(result, json)

    def test_invalid_image_id(self):
        """Should raise EmbedException"""

        image_id = DispatchTestHelpers.upload_image(self.client)

        data = {
            'image_id' : -1,
            'caption' : 'This is a test caption',
            'credit' : 'This is a test credit'
        }

        try:
            result = embeds.embedlib.to_json('image', data)
            self.fail('Invalid image id should have raised exception')
        except embeds.EmbedException:
            pass

    def test_gallery_controller(self):

        # Test "render" with gallery controller, uses "get_gallery" and "prepare_data"
        # Make a gallery and get its data
        gallery, img_id1, img_id2 = DispatchTestHelpers.create_gallery(0, self.client)
        data = gallery.data

        # Render the data to html
        result_1 = embeds.embedlib.render('gallery', data)

        # Get the unique url that is produced when creating the gallery
        abs_url = data['images'][1]['image']['filename'].replace('.png', '')

        # Expected output
        output = '<div class="gallery-attachment">\n    <div class="images">\n        \n        <img src="images/2017/05/test_image.png" />\n        \n        <img src="images/2017/05/%s.png" />\n        \n    </div>\n</div>\n' % abs_url

        self.assertEqual(result_1, output)

        # Test "to_json"
        result_2 = embeds.GalleryController.to_json(data)

        json_created_at = data['images'][0]['image']['created_at']
        json_updated_at = data['images'][0]['image']['updated_at']

        self.assertEqual(result_2['title'], u'Gallery Title 0')
        self.assertEqual(result_2['id'], 1)
        self.assertEqual(result_2['gallery']['images'][1]['image']['filename'], abs_url + '.png')
        self.assertEqual(result_2['gallery']['images'][0]['image']['created_at'], json_created_at)
        self.assertEqual(result_2['gallery']['images'][0]['image']['updated_at'], json_updated_at)

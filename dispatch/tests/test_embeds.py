from dispatch.apps.frontend import embeds
from django.test import TestCase
from django.template import loader

class EmbedsTest(TestCase):

    def test_list_controller(self):

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

        data_1 = {
            'id' : '1234', # youtube video id
            'title' : 'Test title',
            'caption' : 'Test caption',
            'credit' : 'Test credit'
        }
        data_2 = {
            'id' : '1234', # youtube video id
            'title' : 'Test title',
            'caption' : 'Test caption',
        }
        data_3 = {
            'id' : '1234', # youtube video id
            'title' : 'Test title',
            'credit' : 'Test credit'
        }
        data_4 = {
            'id' : '1234', # youtube video id
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

        data = {
            'id' : '123'
        }

        try:
            result = embeds.embedlib.render('test', data)
            self.fail('EmbedDoesNotExist exception should have been raised')
        except embeds.EmbedDoesNotExist:
            pass

    def test_register_existing_type(self):

        data_1 = {
            'size' : 'h1',
            'content' : 'Header text'
        }

        embeds.embedlib.register('quote', embeds.HeaderController)

        result = embeds.embedlib.render('quote', data_1)

        self.assertEqual(result, '<h1>Header text</h1>')

from dispatch.apps.frontend import embeds
from django.test import TestCase

class EmbedsTest(TestCase):

    def test_list_controller(self):

        data = [
            'item 1',
            'item 2',
            'item 3'
        ]

        result = embeds.ListController.render(data)

        self.assertEqual(result, '<ul><li>item 1</li><li>item 2</li><li>item 3</li></ul>')

    def test_header_controller(self):

        data_1 = {
            'size' : 'h1',
            'content' : 'Header text'
        }

        data_2 = {
            'size' : 'h4',
            'content' : 'Header text'
        }

        result_1 = embeds.HeaderController.render(data_1)
        result_2 = embeds.HeaderController.render(data_2)

        self.assertEqual(result_1, '<h1>Header text</h1>')
        self.assertEqual(result_2, '<h1>Header text</h1>')

    def test_code_controller(self):

        data_1 = {
            'mode' : 'javascript',
            'content' : 'var test = 1;'
        }

        data_2 = {
            'mode' : 'css',
            'content' : 'body { color:red; }' # Not sure what code to put here
        }

        data_3 = {
            'mode' : 'html',
            'content' : '<b>test</b>' # Not sure what code to put here
        }

        result_1 = embeds.CodeController.render(data_1)
        result_2 = embeds.CodeController.render(data_2)
        result_3 = embeds.CodeController.render(data_3)

        self.assertEqual(result_1, '<script>var test = 1;</script>')
        self.assertEqual(result_2, '<style>body { color:red; }</style>')
        self.assertEqual(result_3, '<b>test</b>')

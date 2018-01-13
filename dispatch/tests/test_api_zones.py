from django.core.urlresolvers import reverse

from rest_framework import status

from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers

from dispatch.theme import register
from dispatch.theme.widgets import Zone, Widget
from dispatch.theme.fields import CharField

TEST_ZONE_A_ID = 'test-zone-a'
TEST_ZONE_A_NAME = 'Test Zone A'

TEST_ZONE_B_ID = 'test-zone-b'
TEST_ZONE_B_NAME = 'Test Zone B'

TEST_WIDGET_A_ID = 'test-widget-a'
TEST_WIDGET_A_NAME = 'Test Widget A'
TEST_WIDGET_A_TEMPLATE  = 'widgets/test-widget-a.html'

TEST_WIDGET_B_ID = 'test-widget-b'
TEST_WIDGET_B_NAME = 'Test Widget B'
TEST_WIDGET_B_TEMPLATE  = 'widgets/test-widget-b.html'

TEST_WIDGET_C_ID = 'test-widget-c'
TEST_WIDGET_C_NAME = 'Test Widget C'

class TestZoneA(Zone):
    id = TEST_ZONE_A_ID
    name = TEST_ZONE_A_NAME

class TestZoneB(Zone):
    id = TEST_ZONE_B_ID
    name = TEST_ZONE_B_NAME

class TestWidgetA(Widget):
    id = TEST_WIDGET_A_ID
    name = TEST_WIDGET_A_NAME
    template = TEST_WIDGET_A_TEMPLATE

    zones = [TestZoneA, TestZoneB]

    title = CharField('Title')

class TestWidgetB(Widget):
    id = TEST_WIDGET_B_ID
    name = TEST_WIDGET_B_NAME
    template = TEST_WIDGET_B_TEMPLATE

    zones = [TestZoneA, TestZoneB]

    title = CharField('Title')


class TestWidgetC(TestWidgetB):
    id = TEST_WIDGET_C_ID
    name = TEST_WIDGET_C_NAME
    template = TEST_WIDGET_B_TEMPLATE

    zones = [TestZoneA, TestZoneB]

    title = CharField('Title')

    def before_save(self, data):
        data['title'] += ' TEST'
        return data

class ZonesTests(DispatchAPITestCase):

    def tearDown(self):
        """Clear the theme registry after each test"""
        super(ZonesTests, self).tearDown()

        register.clear()

    def test_zones_list_unauthenticated(self):
        """Zone list should return 401 with unauthenticated request"""

        url = reverse('api-zones-list')

        self.client.credentials()

        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['detail'], 'Authentication credentials were not provided.')

    def test_zones_list_empty(self):
        """Zone list should be empty when no zones are defined"""

        register.clear()

        url = reverse('api-zones-list')

        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)
        self.assertEqual(len(response.data['results']), 0)

    def test_zones_list(self):
        """Zone list should return list of registered zones"""

        register.zone(TestZoneA)
        register.zone(TestZoneB)

        url = reverse('api-zones-list')

        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)

        self.assertEqual(response.data['results'][0]['id'], TEST_ZONE_A_ID)
        self.assertEqual(response.data['results'][1]['id'], TEST_ZONE_B_ID)

    def test_zones_search(self):
        """Zone search should return list of zones matching search criteria"""

        register.zone(TestZoneA)
        register.zone(TestZoneB)

        url = '%s?q=%s' % (reverse('api-zones-list'), 'Test+Zone+B')

        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

        self.assertEqual(response.data['results'][0]['id'], TEST_ZONE_B_ID)

    def test_zones_detail_unauthenticated(self):
        """Zone detail should return 401 with unauthenticated request"""

        register.zone(TestZoneA)

        url = reverse('api-zones-detail', args=[TEST_ZONE_A_ID])

        self.client.credentials()

        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['detail'], 'Authentication credentials were not provided.')

    def test_zones_detail_not_found(self):
        """Zone detail should return 404 with invalid zone id"""

        register.zone(TestZoneA)

        url = reverse('api-zones-detail', args=[TEST_ZONE_B_ID])

        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], "The zone with id '%s' does not exist" % TEST_ZONE_B_ID)

    def test_zones_detail(self):
        """Zone detail should return information for specific zone"""

        register.zone(TestZoneA)
        register.zone(TestZoneB)

        url = reverse('api-zones-detail', args=[TEST_ZONE_A_ID])

        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], TEST_ZONE_A_ID)
        self.assertEqual(response.data['name'], TEST_ZONE_A_NAME)

    def test_zones_list_widgets_empty(self):
        """Zone widget list should return empty when no widgets registered"""

        register.zone(TestZoneA)

        url = reverse('api-zones-widgets', args=[TEST_ZONE_A_ID])

        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)
        self.assertEqual(len(response.data['results']), 0)

    def test_zones_list_widgets(self):
        """Should be able to return list of widgets registered with zone"""

        register.zone(TestZoneA)
        register.widget(TestWidgetA)
        register.widget(TestWidgetB)

        url = reverse('api-zones-widgets', args=[TEST_ZONE_A_ID])

        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)
        self.assertEqual(response.data['results'][0]['id'], TEST_WIDGET_A_ID)
        self.assertEqual(response.data['results'][1]['id'], TEST_WIDGET_B_ID)

    def test_zones_update_unauthenticated(self):
        """Zone update should fail with unauthenticated request"""

        register.zone(TestZoneA)
        register.widget(TestWidgetA)

        url = reverse('api-zones-detail', args=[TEST_ZONE_A_ID])

        data = {
            'widget': TEST_WIDGET_A_ID,
            'data': {
                'title': 'Test title'
            }
        }

        self.client.credentials()

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['detail'], 'Authentication credentials were not provided.')

    def test_zones_update_not_found(self):
        """Zone update should return 404 with invalid zone id"""

        register.zone(TestZoneA)
        register.widget(TestWidgetA)

        url = reverse('api-zones-detail', args=[TEST_ZONE_B_ID])

        data = {
            'id': TEST_WIDGET_A_ID,
            'widget': {
                'title': 'Test title'
            }
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        register.clear()

    def test_zones_update_set_widget(self):
        """Should be able to set widget on empty zone"""

        register.zone(TestZoneA)
        register.widget(TestWidgetA)

        url = reverse('api-zones-detail', args=[TEST_ZONE_A_ID])

        data = {
            'widget': TEST_WIDGET_A_ID,
            'data': {
                'title': 'Test title'
            }
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data['id'], TEST_ZONE_A_ID)
        self.assertEqual(response.data['widget']['id'], TEST_WIDGET_A_ID)
        self.assertEqual(response.data['data']['title'], 'Test title')

    def test_zones_update_set_invalid_widget(self):
        """Should not be able to set non-existent widget"""

        register.zone(TestZoneA)
        register.widget(TestWidgetA)

        url = reverse('api-zones-detail', args=[TEST_ZONE_A_ID])

        data = {
            'widget': TEST_WIDGET_B_ID,
            'data': {}
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['widget'][0], "Widget with id '%s' does not exist" % TEST_WIDGET_B_ID)

    def test_zones_update_change_widget(self):
        """Should be able to change the widget on a zone"""

        register.zone(TestZoneA)
        register.widget(TestWidgetA)
        register.widget(TestWidgetB)

        url = reverse('api-zones-detail', args=[TEST_ZONE_A_ID])

        data = {
            'widget': TEST_WIDGET_A_ID,
            'data': {}
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], TEST_ZONE_A_ID)
        self.assertEqual(response.data['widget']['id'], TEST_WIDGET_A_ID)

        data = {
            'widget': TEST_WIDGET_B_ID,
            'data': {}
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], TEST_ZONE_A_ID)
        self.assertEqual(response.data['widget']['id'], TEST_WIDGET_B_ID)

    def test_zones_update_widget(self):
        """Should be able to update widget data"""

        register.zone(TestZoneA)
        register.widget(TestWidgetA)

        url = reverse('api-zones-detail', args=[TEST_ZONE_A_ID])

        data = {
            'widget': TEST_WIDGET_A_ID,
            'data': {
                'title': 'Test A'
            }
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['title'], 'Test A')

        data = {
            'widget': TEST_WIDGET_A_ID,
            'data': {
                'title': 'Test B'
            }
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['title'], 'Test B')

    def test_zones_update_widget_before_save(self):
        """Test before_save method on widget"""

        register.zone(TestZoneA)
        register.widget(TestWidgetC)

        url = reverse('api-zones-detail', args=[TEST_ZONE_A_ID])

        data = {
            'widget': TEST_WIDGET_C_ID,
            'data': {
                'title': 'Test C'
            }
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['title'], 'Test C TEST')

    def test_zones_update_remove_widget(self):
        """Should be able to remove widget from zone"""

        register.zone(TestZoneA)
        register.widget(TestWidgetA)

        url = reverse('api-zones-detail', args=[TEST_ZONE_A_ID])

        data = {
            'widget': TEST_WIDGET_A_ID,
            'data': {
                'title': 'Test A'
            }
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['title'], 'Test A')

        data = {
            'widget': None
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['widget'], None)
        self.assertEqual(response.data['data'], {})

    def test_widgets_validate_data(self):
        """Should be able to valiate your data"""

        register.zone(TestZoneA)
        register.widget(TestWidgetA)

        url = reverse('api-zones-detail', args=[TEST_ZONE_A_ID])

        data = {
            'widget': TEST_WIDGET_A_ID,
            'data': {
                'title': 'Test A'
            }
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.data['data']['title'], 'Test A')

    def test_widgets_invalid_data(self):
        """Invalid data should raise an error"""

        register.zone(TestZoneA)
        register.widget(TestWidgetA)

        url = reverse('api-zones-detail', args=[TEST_ZONE_A_ID])

        data = {
            'widget': TEST_WIDGET_A_ID,
            'data': {
                'title': 0
            }
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['title'][0], 'Title data must be a string')

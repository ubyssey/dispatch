from django.test import TestCase

from dispatch.apps.core.integrations import BaseIntegration
from dispatch.apps.core.models import IntegrationSetting

class IntegrationTestCase(TestCase):

    class TestIntegration(BaseIntegration):

        ID = 'test-integration'

    def test_integration_returns_empty_settings(self):

        self.assertEqual(self.TestIntegration.get_settings(), {})

    def test_integration_adds_new_settings(self):

        self.TestIntegration.update_setting('setting_a', 'a')
        self.TestIntegration.update_setting('setting_b', 'b')

        settings = self.TestIntegration.get_settings()

        self.assertEqual(settings['setting_a'], 'a')
        self.assertEqual(settings['setting_b'], 'b')

    def test_integration_updates_existing_setting(self):

        # Set setting_a to 1
        self.TestIntegration.update_setting('setting_a', '1')

        # Verify that setting_a has been saved as 1
        settings = self.TestIntegration.get_settings()
        self.assertEqual(settings['setting_a'], '1')

        # Update setting_a to 2
        self.TestIntegration.update_setting('setting_a', '2')

        # Verify that setting_a has been updated to 2
        settings = self.TestIntegration.get_settings()
        self.assertEqual(settings['setting_a'], '2')

    def test_integration_hidden_settings(self):

        self.TestIntegration.update_setting('setting_c', 'c')
        self.TestIntegration.update_setting('setting_d', 'd', is_hidden=True)

        settings = self.TestIntegration.get_settings()

        self.assertEqual(settings['setting_c'], 'c')
        self.assertEqual('setting_d' in settings, False)

        settings = self.TestIntegration.get_settings(show_hidden=True)

        self.assertEqual(settings['setting_c'], 'c')
        self.assertEqual(settings['setting_d'], 'd')

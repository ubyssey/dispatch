from django.core.urlresolvers import reverse

from rest_framework import status
from rest_framework.authtoken.models import Token

from dispatch.tests.cases import DispatchAPITestCase

from dispatch.apps.content.models import Article, User

class AuthenticationTests(DispatchAPITestCase):

    def test_login(self):
        """
        login(email, password) -> user logs in successfully, token is returned by api
        """
        url = reverse('auth-token')

        data = {
            'email': 'test@test.com',
            'password': 'testing123'
        }

        response = self.client.post(url, data, format='json')
        self.assertIsNotNone(response.data.get("token"))
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

    def test_logout(self):
        """
        login(email, password) -> logout -> user logs out successfully, db should no longer have token
        """
        url = reverse('auth-token')

        logout_response = self.client.delete(url, {}, format='json')

        # Try to get the token, if it doesn't exist, return None.
        user = User.objects.get(email='test@test.com')
        try:
            token = Token.objects.get(user_id=user.id)
        except Token.DoesNotExist:
            token = None

        self.assertIsNone(token)

    def test_login_with_no_params(self):
        """
        login() -> login fails, 404
        """
        url = reverse('auth-token')

        data = {}

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_no_email(self):
        """
        login({password}) => login fails, 404
        """
        url = reverse('auth-token')

        data = {
            'password': 'testing123'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_no_password(self):
        """
        login({email}) => login fails, 404
        """
        url = reverse('auth-token')

        data = {
            'email': 'test@test.com'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_an_account_that_doesnt_exist(self):
        """
        login({email, password}) => login fails, 404
        """
        url = reverse('auth-token')

        data = {
            'email': 'test1@test.com',
            'password': 'thisshouldfail'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout_when_no_token_exists(self):
        """
        logout should fail, 404
        """
        # setup
        url = reverse('auth-token')
        data = {
            'email': 'test@test.com',
            'password': 'testing123'
        }
        response = self.client.post(url, data, format='json')
        user = User.objects.get(email='test@test.com')
        token = Token.objects.get(user_id=user.id)
        token.delete()

        response = self.client.delete(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

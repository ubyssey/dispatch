from django.core.urlresolvers import reverse

from rest_framework import status

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

    def test_logging_in_with_same_user_returns_same_token(self):
        """
        Read the name, returns 202
        """
        print("title tk")


    def test_access_data_while_authenticated(self):
        # access something that requies auth -> required item is returned.
        print("title tk")

    def test_logout(self):
        """
        logout -> user logs out successfully, db should no longer have token
        """
        url = reverse('auth-token')

    def test_access_data_while_unauthenticated(self):
        """
        access something tha requires auth -> access denied b/c no token was provided
        """
        print("title tk")

    def test_login_with_no_params(self):
        """
        login() -> login fails, 404
        """
        print("title tk")

    def test_login_with_no_email(self):
        """
        login({password}) => login fails, 404
        """
        print("title tk")

    def test_login_with_no_password(self):
        """
        login({email}) => login fails, 404
        """
        print("title tk")

    def test_login_with_an_account_that_doesnt_exist(self):
        """
        login({email, password}) => login fails, 404
        """
        print("title tk")

    def test_logout_when_no_token_exists(self):
        """
        logout should fail, 404
        """

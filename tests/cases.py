from django.test import TestCase

from rest_framework.test import APIRequestFactory, APIClient
from rest_framework.authtoken.models import Token

from dispatch.apps.core.models import User

class DispatchAPITestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super(DispatchAPITestCase, cls).setUpClass()
        user = User.objects.create_user('test@test.com', 'testing123')
        (token, created) = Token.objects.get_or_create(user=user)

    def setUp(self):
        user = User.objects.get(email='test@test.com')
        token = Token.objects.get(user_id=user.id)

        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

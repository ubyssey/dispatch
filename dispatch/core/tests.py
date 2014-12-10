from django.test import TestCase

from django.contrib.auth import get_user_model, authenticate, login

User = get_user_model()

class UserTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user("peterjsiemens@gmail.com", "password")

    def test_add_user(self):
        self.assertEqual(self.user.email, "peterjsiemens@gmail.com")

    def test_authenticate_user(self):

        self.user.save()

        email = "peterjsiemens@gmail.com"
        password = "password"

        userA = authenticate(email=email, password=password)

        if userA is not None:
            self.assertTrue(userA.is_active)
        else:
            self.fail()
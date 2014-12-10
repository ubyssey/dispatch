from django.test import TestCase

from django.contrib.auth import get_user_model, authenticate, login
from django.db import IntegrityError


User = get_user_model()

class UserTests(TestCase):

    def setUp(self):
        self.user_a = User.objects.create_user("peterjsiemens@gmail.com", "password1")
        self.user_b = User.objects.create_user("peterjsiemens@gmail.com", "password2")

    def test_create_user(self):
        self.assertEqual(self.user_a.email, "peterjsiemens@gmail.com")
        self.assertEqual(self.user_a, self.user_b) # Make sure objects are equal (no duplicates)

    def test_save_single_user(self):
        self.user_a.save()
        try:
            user = User.objects.get(email="peterjsiemens@gmail.com")
            self.assertEqual(self.user_a, user)
        except User.DoesNotExist:
            self.fail()

    def test_save_duplicate_user(self):
        self.user_a.save()
        try:
            self.user_b.save()
            self.fail("User shouldn't have saved")
        except IntegrityError:
            pass

    def test_authenticate_user(self):

        self.user_a.save()

        email = "peterjsiemens@gmail.com"
        password = "password1"

        user = authenticate(email=email, password=password)

        if user is not None:
            self.assertTrue(user.is_active)
        else:
            self.fail()
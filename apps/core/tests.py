from django.test import TestCase

from django.contrib.auth import get_user_model, authenticate, login
from django.db import IntegrityError

User = get_user_model()

class UserTests(TestCase):
    DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'dispatch',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',   # Or an IP Address that your DB is hosted on
        'PORT': '3306',
    }
}
    EMAIL = "peterjsiemens@gmail.com"
    PASS = "password1"
    ADMIN_EMAIL = "webmaster@ubyssey.ca"

    def setUp(self):
        self.user_a = User.objects.create_user(self.EMAIL, self.PASS)

    def test_create_single_user(self):
        try:
            user = User.objects.get(email=self.EMAIL)
            self.assertEqual(self.user_a, user)
        except User.DoesNotExist:
            self.fail()

    def test_create_duplicate_user(self):
        try:
            user_b = User.objects.create_user(self.EMAIL, self.PASS)
            self.fail("User shouldn't have saved")
        except IntegrityError:
            pass

    def test_create_superuser(self):
        User.objects.create_superuser(self.ADMIN_EMAIL, self.PASS)

    def test_authenticate_user(self):
        user = authenticate(email=self.EMAIL, password=self.PASS)

        if user is not None:
            self.assertTrue(user.is_active)
        else:
            self.fail()
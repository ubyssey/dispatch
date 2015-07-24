from django.test import TestCase
from django.contrib.auth import get_user_model, authenticate, login
from django.db import IntegrityError
from dispatch.apps.core.models import Person, ContributorRole

User = get_user_model()

class UserTests(TestCase):

    EMAIL = "johndoe@gmail.com"
    PASS = "password1"

    ADMIN_EMAIL = "webmaster@ubyssey.ca"

    def setUp(self):
        self.u1 = User.objects.create_user(self.EMAIL, self.PASS)

    def test_user_str(self):
        self.assertEquals(self.u1.__str__(), self.EMAIL)
        p1 = Person(full_name="John Doe")
        p1.save()
        self.u1.person = p1
        self.u1.save()
        self.assertEquals(self.u1.__str__(), "John Doe")

    def test_create_single_user(self):
        try:
            user = User.objects.get(email=self.EMAIL)
            self.assertEqual(self.u1, user)
        except User.DoesNotExist:
            self.fail()

    def test_create_duplicate_user(self):
        try:
            u2 = User.objects.create_user(self.EMAIL, self.PASS)
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

class PersonTests(TestCase):

    def setUp(self):
        self.p1 = Person(
            full_name = "John Doe",
        )
        self.p1.save()

    def test_make_contributor(self):
        writer = ContributorRole(title="writer")
        writer.save()
        self.p1.roles.add(writer)

        roles = self.p1.roles.all()
        if writer not in roles:
            self.fail()

    def test_person_str(self):
        self.assertEquals(self.p1.__str__(), "John Doe")

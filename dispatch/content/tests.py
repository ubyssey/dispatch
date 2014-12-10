from django.test import TestCase
from django.utils import timezone
from django.db import IntegrityError
from content.models import Section, Article, Image

class SectionTests(TestCase):
    NAME = "News"

    def setUp(self):
        self.s1 = Section.objects.create(name=self.NAME)

    def test_no_duplicate_section_names(self):
        with self.assertRaises(IntegrityError):
            s2 = Section.objects.create(name=self.NAME)
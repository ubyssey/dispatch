from django.test import TestCase
from django.utils import timezone
from django.db import IntegrityError
from apps.content.models import Section, Article, Image

class SectionTests(TestCase):
    NAME = "News"
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
    def setUp(self):
        self.s1 = Section.objects.create(name=self.NAME)

    def test_no_duplicate_section_names(self):
        with self.assertRaises(IntegrityError):
            s2 = Section.objects.create(name=self.NAME)


class ArticleTests(TestCase):
    def setUp(self):
        sCulture = Section.objects.create(name="Culture")

        self.A1 = {
            "long_headline": "Buchanan Tower Rated Uglier Than One Yonge Street",
            "short_headline": "BuTo Strikes Fear",
            "section": sCulture,
            "published_at": timezone.now(),
            "slug": "buto-strikes-fear",
            "content": "Refer to headline."
        }
        self.article1 = Article.objects.create(**self.A1)

    def test_no_duplicate_slugs(self):
        with self.assertRaises(IntegrityError):
            article2 = Article.objects.create(**self.A1)
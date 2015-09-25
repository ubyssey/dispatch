from django.test import TestCase
from django.utils import timezone
from django.db import IntegrityError
from dispatch.apps.content.models import Section, Article, Image
from dispatch.apps.core.models import Person

class SectionTests(TestCase):
    # NAME = "News"
    # SLUG = "news"
    #
    # def setUp(self):
    #     self.s1 = Section.objects.create(name=self.NAME, slug=self.SLUG)
    #
    # def test_no_duplicate_section_names(self):
    #     with self.assertRaises(IntegrityError):
    #         s2 = Section.objects.create(name=self.NAME)
    pass


class ArticleTests(TestCase):
    # def setUp(self):
    #     sCulture = Section.objects.create(name="Culture")
    #     author = Person.objects.create(
    #         first_name="John",
    #         last_name="Doe")
    #
    #     self.A1 = {
    #         "headline": "Buchanan Tower Rated Uglier Than One Yonge Street",
    #         "section": sCulture,
    #         "published_at": timezone.now(),
    #         "slug": "buto-strikes-fear",
    #         "content": "Refer to headline."
    #     }
    #     self.article1 = Article.objects.create(**self.A1)
    #     self.article1.authors.add(author)
    #
    # def test_no_duplicate_slugs(self):
    #     with self.assertRaises(IntegrityError):
    #         article2 = Article.objects.create(**self.A1)
    pass

from django.test import TestCase
from django.utils import timezone
from content.models import Section, Article, Image

class SectionTests(TestCase):
    NAME = "News"

    def setUp(self):
        self.section = Section.objects.create(name=self.NAME)

    def test_add_section(self):
        self.assertEqual(self.section.name,
                         self.NAME)


class ArticleTests(TestCase):
    def setUp(self):
        section = Section.objects.create(name="Sports")

        self.A1 = {
            "long_headline": "Buchanan Tower Beats One Yonge Street as Ugliest Building",
            "section": section,
            "published_at": timezone.now(),
            "content": "Refer to headline."
        }

        self.test_a1 = Article.objects.create(**self.A1)

    def test_add_article(self):
        for key, expected in self.A1.viewitems():
            self.assertEqual(getattr(self.test_a1, key),
                             expected)
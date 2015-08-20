import json
from bs4 import BeautifulSoup
import urllib
import dateutil.parser

import sys
reload(sys)
sys.setdefaultencoding("utf-8")

from django.conf import settings

from dispatch.apps.content.models import Article, Section, Author, Image, ImageAttachment

class WordpressImporter:

    OLD_SHORTCODES = ('[ub_topshare2]',)

    def load(self, filename):
        with open(filename) as data_file:
            self.articles = json.load(data_file)

    def save(self, count=None):

        Article.objects.filter(section__slug='news').delete()

        n = 0
        for article in self.articles:
            self.save_article(article)
            n += 1
            if count is not None and n >= count:
                return


    def save_article(self, data):

        slug = data['url'].rsplit('/',2)[1]

        try:
            Article.objects.filter(slug=slug).delete()
        except:
            pass


        try:
            author = Person.objects.get(full_name=data['author'])
        except:
            author = Person.objects.create(full_name=data['author'])

        article = Article()
        article.long_headline = data['title']
        article.short_headline = data['title']

        article.slug = slug
        article.snippet = data['description']
        article.seo_keyword = data['keyword']
        article.seo_description = data['description']


        date = dateutil.parser.parse(data['date'])

        article.status = Article.PUBLISHED
        article.published_at = date

        try:
            section = Section.objects.get(slug=data['post_type'])
        except:
            section = Section.objects.create(slug=data['post_type'], name=data['post_type'])

        article.section = section

        article.save()

        Author.objects.create(article=article,person=author,order=0)

        article.content = self.save_content(data['content'], article)

        if article.featured_image is None and data['featured_image']:
            article.featured_image = self.save_attachment(data['featured_image'], article)

        article.save(revision=False)

    def save_content(self, content, article):
        lines = [s.strip() for s in content.splitlines()]

        output = []
        n = 0
        for line in lines:
            line.strip()
            soup = BeautifulSoup(line, 'html.parser')
            if soup.img:
                if n == 0:
                    article.featured_image = self.save_attachment(soup.img['src'], article, caption=soup.img['alt'])
                else:
                    for img in soup.find_all('img'):
                        output.append(self.save_image(img, article))
            elif line not in self.OLD_SHORTCODES and line != '':
                output.append(line)
            n += 1

        return json.dumps(output)

    def save_attachment(self, src, article, caption=None):

        filename = src.replace('http://ubyssey.ca/wp-content/uploads/', 'images/')

        try:
            image = Image.objects.get(img=filename)
        except:
            image = Image()
            image.img = filename

            print settings.MEDIA_ROOT + '/' + filename

            try:
                urllib.urlretrieve(src, settings.MEDIA_ROOT + '/' + filename)
            except:
                print 'Bad URL'
                return

            image.img.name = filename
            try:
                image.save()
            except:
                print 'Image could not be saved'
                return

        try:
            attachment = ImageAttachment.objects.get(article=article, image=image)
        except:
            attachment = ImageAttachment.objects.create(article=article, image=image, caption=caption)

        return attachment

    def save_image(self, img, article):
        attachment = self.save_attachment(img['src'], article, caption=img['alt'])

        return {
            'type': 'image',
            'data': {
                'attachment_id': attachment.id,
            }
        }


    def count(self):
        return len(self.articles)

importer = WordpressImporter()
importer.load('results.json')
print importer.save()
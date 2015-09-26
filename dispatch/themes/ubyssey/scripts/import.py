import json, re
from bs4 import BeautifulSoup
import urllib
import dateutil.parser

import sys
reload(sys)
sys.setdefaultencoding("utf-8")

from django.conf import settings

from dispatch.apps.core.models import Person
from dispatch.apps.content.models import Article, Section, Author, Image, ImageAttachment

class ShortcodeLibrary:

    def __init__(self):
        self.functions = {}

    def register(self, name, function):
        self.functions[name] = function

    def call(self, func_name, content, kwargs):
        try:
            return self.functions[func_name](content, **kwargs)
        except:
            return ""

sclib = ShortcodeLibrary()

def sc_ub_ad(content, **args):
    return {
        'type': 'advertisement',
        'data': {}
    }

def sc_ub_subhead(content, **args):

    return {
        'type': 'header',
        'data': {
            'content': content,
            'size': "H1"
        },
    }

sclib.register('ub_subhead', sc_ub_subhead)
#sclib.register('ub_ad', sc_ub_ad)

SHORTCODE_EXCLUDES = ['caption',]

def process_shortcodes(line):

    code = re.match(r'\[([^\[\]|]*)\]((.*)\[\/([^\[\]|]*))?', line)

    if code:
        func = code.group(1).split(" ")

        content = code.group(2)

        if func:
            func_name = func[0]
            if func_name not in SHORTCODE_EXCLUDES:

                args = func[1:]

                args_dict = {}

                for arg in args:
                    pieces = arg.split("=")
                    if len(pieces) == 2:
                        args_dict[pieces[0]] = pieces[1]

                return sclib.call(func_name, content, args_dict)

    return line

class WordpressImporter:

    def load(self, filename):
        with open(filename) as data_file:
            self.articles = json.load(data_file)

    def save(self, count=None):

        Article.objects.filter(section__slug=self.articles[0]['post_type']).delete()

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

        title = str(BeautifulSoup(data['title'], 'html.parser'))
        article.headline = title

        article.slug = slug
        article.snippet = data['description']
        article.seo_keyword = data['keyword']
        article.seo_description = data['description']

        date = dateutil.parser.parse(data['date'])

        article.status = Article.DRAFT
        article.is_published = True
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

        print article.headline

    def save_content(self, content, article):
        lines = [s.strip() for s in content.splitlines()]

        output = []
        n = 0
        for line in lines:
            line.strip()

            line = process_shortcodes(line)

            if type(line) != dict:
                soup = BeautifulSoup(line, 'html.parser')
                if soup.img:
                    if n == 0:
                        try:
                            caption = soup.img['alt']
                        except:
                            caption = None
                        article.featured_image = self.save_attachment(soup.img['src'], article, caption=caption)
                    else:
                        for img in soup.find_all('img'):
                            image_json = self.save_image(img, article)
                            if image_json is not None:
                                output.append(self.save_image(img, article))
                    continue

            if line != '':
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

            try:
                urllib.urlretrieve(src, settings.MEDIA_ROOT + '/' + filename)
            except:
                return

            image.img.name = filename
            try:
                image.save()
            except:
                return

        try:
            attachment = ImageAttachment.objects.get(article=article, image=image)
        except:
            attachment = ImageAttachment.objects.create(article=article, image=image, caption=caption)

        return attachment

    def save_image(self, img, article):
        try:
            caption = soup.img['alt']
        except:
            caption = None

        attachment = self.save_attachment(img['src'], article, caption=caption)

        if attachment is not None:

            return {
                'type': 'image',
                'data': {
                    'attachment_id': attachment.id,
                }
            }

        else:
            return

    def count(self):
        return len(self.articles)

importer = WordpressImporter()
importer.load('results-2015-sports.json')
importer.save()
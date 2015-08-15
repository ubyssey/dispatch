# Django imports
from django.shortcuts import render_to_response
from django.http import HttpResponse, Http404
from django.shortcuts import render
from django.conf import settings

# Dispatch imports
from dispatch.apps.content.models import Article, Section
from dispatch.apps.core.models import Person
from dispatch.apps.frontend.themes.default import DefaultTheme
from dispatch.apps.frontend.helpers import templates

# Ubyssey imports
from .pages import Homepage

class UbysseyTheme(DefaultTheme):

    SITE_TITLE = 'The Ubyssey'
    SITE_URL = settings.BASE_URL

    def get_article_meta(self, article):

        return {
            'title': "%s - %s" % (article.long_headline, self.SITE_TITLE),
            'description': article.seo_description if article.seo_description is not None else "",
            'url': article.get_absolute_url,
            'image': article.featured_image.image.get_absolute_url(),
            'author': article.get_author_string()
        }


    def home(self, request):

        frontpage = Article.objects.get_frontpage()

        frontpage_ids = [int(a.id) for a in frontpage[:2]]

        sections = Article.objects.get_sections(exclude=('blog',),frontpage=frontpage_ids)

        articles = {
              'primary': frontpage[0],
              'secondary': frontpage[1],
              'thumbs': frontpage[2:4],
              'bullets': frontpage[4:6],
         }

        page = Homepage()

        popular = Article.objects.get_popular()[:5]

        context = {
            'meta': {
                'title':  "%s - UBC's official student newspaper" % self.SITE_TITLE,
                'description': 'Weekly student newspaper of the University of British Columbia.',
                'url': self.SITE_URL,
                'image': articles['primary'].featured_image.image.get_absolute_url()
            },
            'title': "%s - UBC's official student newspaper" % self.SITE_TITLE,
            'articles': articles,
            'sections': sections,
            'popular':  popular,
            'components': page.components(),
        }

        return render(request, 'homepage/base.html', context)

    def article(self, request, section=False, slug=False):

        article = self.find_article(request, section, slug)

        article.add_view()

        ref = request.GET.get('ref', None)
        dur = request.GET.get('dur', None)

        context = {
            'meta': self.get_article_meta(article),
            'article': article,
            'reading_list': article.get_reading_list(ref=ref, dur=dur),
            'base_template': 'base.html'
        }

        return render(request, article.get_template(), context)

    def section(self, request, section):

        section = Section.objects.get(slug=section)
        articles = Article.objects.filter(status=Article.PUBLISHED,section=section)

        context = {
            'section': section,
            'articles': articles,
        }

        return render(request, 'section/base.html', context)

    def author(self, request, pk=None):

        person = Person.objects.get(pk=pk)

        context = {
            'person': person,
        }

        return render(request, 'author.html', context)

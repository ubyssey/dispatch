# Django imports
from django.shortcuts import render_to_response
from django.http import HttpResponse, Http404
from django.shortcuts import render
from django.conf import settings

# Dispatch imports
from dispatch.apps.content.models import Article, Section
from dispatch.apps.frontend.themes.default import DefaultTheme
from dispatch.apps.frontend.helpers import templates

# Ubyssey imports
from .pages import Homepage

class UbysseyTheme(DefaultTheme):

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

        popular = Article.objects.get_most_popular(5)

        context = {
            'articles': articles,
            'sections': sections,
            'popular':  popular,
            'components': page.components(),
        }

        return render(request, 'homepage/base.html', context)

    def article(self, request, section=False, slug=False):

        article = self.find_article(request, section, slug)

        context = {
            'article': article
        }

        return render(request, article.get_template(), context)

    def section(self, request, section):

        section = Section.objects.get(slug=section)
        articles = Article.objects.filter(head=True,section=section)

        context = {
            'section': section,
            'articles': articles,
        }

        return render(request, 'section/base.html', context)

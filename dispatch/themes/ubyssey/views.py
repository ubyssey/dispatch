# Django imports
from django.shortcuts import render_to_response
from django.http import HttpResponse, Http404
from django.template import loader
from django.shortcuts import render
from django.conf import settings
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

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

        try:
            image = article.featured_image.image.get_absolute_url(),
        except:
            image = None

        return {
            'title': article.long_headline,
            'description': article.seo_description if article.seo_description is not None else article.snippet,
            'url': article.get_absolute_url,
            'image': image,
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

        title = "%s - UBC's official student newspaper" % self.SITE_TITLE

        context = {
            'title': title,
            'meta': {
                'title': title,
                'description': 'Weekly student newspaper of the University of British Columbia.',
                'url': self.SITE_URL
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
            'title': "%s - %s" % (article.long_headline, self.SITE_TITLE),
            'meta': self.get_article_meta(article),
            'article': article,
            'reading_list': article.get_reading_list(ref=ref, dur=dur),
            'base_template': 'base.html'
        }

        t = loader.select_template(["%s/%s" % (article.section.slug, article.get_template()), article.get_template()])
        return HttpResponse(t.render(context))

    def section(self, request, section):

        section = Section.objects.get(slug=section)
        articles = Article.objects.filter(status=Article.PUBLISHED,section=section)

        context = {
            'section': section,
            'articles': {
                'first': articles[0],
                'rest': articles[1:9]
            }
        }

        t = loader.select_template(["%s/%s" % (section.slug, 'section/base.html'), 'section/base.html'])
        return HttpResponse(t.render(context))

    def author(self, request, pk=None):

        person = Person.objects.get(pk=pk)
        articles = Article.objects.filter(authors__id=pk, status=Article.PUBLISHED)[:6]

        context = {
            'person': person,
            'articles': articles
        }

        return render(request, 'author/base.html', context)

    def author_articles(self, request, pk=None):

        person = Person.objects.get(pk=pk)

        order = request.GET.get('order', 'newest')

        if order == 'newest':
            order_by = '-published_at'
        else:
            order_by = 'published_at'

        query = request.GET.get('q', False)

        article_list = Article.objects.filter(authors__id=pk, status=Article.PUBLISHED).order_by(order_by)

        if query:
            article_list = article_list.filter(long_headline__icontains=query)

        paginator = Paginator(article_list, 15) # Show 15 articles per page

        page = request.GET.get('page')

        try:
            articles = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            articles = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            articles = paginator.page(paginator.num_pages)

        context = {
            'person': person,
            'articles': articles,
            'order': order,
            'q': query
        }

        return render(request, 'author/articles.html', context)


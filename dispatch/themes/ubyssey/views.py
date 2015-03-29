from django.shortcuts import render_to_response
from django.http import HttpResponse, Http404
from django.template.loader import get_template
from django.template import RequestContext
from dispatch.apps.content.models import Article
from dispatch.apps.frontend.themes.default import DefaultTheme
from dispatch.apps.frontend.helpers import templates

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

        #articles = Article.objects.filter(head=True)

        #n = 0
        #for article in articles:
        #    article.top = n * 105
        #    n += 1

        #for module in block.modules.all():
        #    print module.render()

        popular = Article.objects.get_most_popular(5)

        context = {
            'articles': articles,
            'sections': sections,
            'popular': popular,
        }

        t = get_template('homepage/base.html')
        c = RequestContext(request, context)
        return HttpResponse(t.render(c))

    def article(self, request, section=False, slug=False):

        article = self.find_article(request, section, slug)

        context = {
            'article': article
        }
        t = get_template('article.html')
        c = RequestContext(request, context)
        return HttpResponse(t.render(c))
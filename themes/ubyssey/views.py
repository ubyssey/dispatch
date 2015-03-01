from django.shortcuts import render_to_response
from django.http import HttpResponse, Http404
from django.template.loader import get_template
from django.template import RequestContext
from dispatch.apps.content.models import Article
from dispatch.apps.frontend.themes.default import DefaultTheme

class UbysseyTheme(DefaultTheme):

    def home(self, request):
        context = {
            'articles': Article.objects.all().order_by('-importance', 'published_at')
        }
        t = get_template('index.html')
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
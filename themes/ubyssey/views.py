from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.template.loader import get_template
from django.template import RequestContext
from dispatch.apps.content.models import Article
from dispatch.apps.frontend.themes.default import DefaultTheme

class UbysseyTheme(DefaultTheme):

    def article(self, request, section=False, slug=False):
        if slug and section:
            article = Article.objects.get(slug=slug, section__name=section)
        context = {
            'article': article,
            'test': 'test'
        }
        t = get_template('article.html')
        c = RequestContext(request, context)
        return HttpResponse(t.render(c))
        #return render_to_response('article.html', context)

    def test(self, request):
        return "test"
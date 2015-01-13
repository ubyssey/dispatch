from django.shortcuts import render_to_response
from dispatch.apps.content.models import Article


class DefaultTheme():

    def home(self, request):
        return render_to_response('index.html')

    def article(self, request, section=False, slug=False):
        if slug and section:
            article = Article.objects.get(slug=slug, section__name=section)
        context = {
            'article': article
        }
        return render_to_response('article.html', context)
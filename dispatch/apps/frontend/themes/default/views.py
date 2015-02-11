from django.shortcuts import render_to_response
from dispatch.apps.content.models import Article
from django.http import Http404


class DefaultTheme():

    def home(self, request):
        return render_to_response('index.html')

    def article(self, request, section=False, slug=False):
        if slug and section:
            article = Article.objects.get(slug=slug, section__name=section)
            if not article.is_published:
                preview = request.GET.get("preview", False)
                print preview
                if not request.user.is_staff or preview == False:
                    raise Http404("This article does not exist.")

        context = {
            'article': article
        }
        return render_to_response('article.html', context)
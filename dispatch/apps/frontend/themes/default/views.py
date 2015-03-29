from django.shortcuts import render_to_response
from dispatch.apps.content.models import Article
from django.http import Http404


class DefaultTheme():

    def home(self, request):
        return render_to_response('index.html')

    def find_article(self, request, section, slug):
        if slug and section:
            preview = request.GET.get("preview", False)
            if preview and request.user.is_staff:
                try:
                    if preview == 'latest':
                        article = Article.objects.filter(slug=slug, section__name=section).order_by('-pk')[0]
                    else:
                        article = Article.objects.get_revision(pk=int(preview))
                except Article.DoesNotExist:
                    raise Http404("Invalid preview ID.")
            else:
                try:
                    article = Article.objects.get(slug=slug, section__name=section, head=True)#is_published=True)
                except Article.DoesNotExist:
                    raise Http404("This article does not exist.")
        return article

    def article(self, request, section=False, slug=False):

        article = self.find_article(request, section, slug)

        context = {
            'article': article
        }
        return render_to_response('article.html', context)
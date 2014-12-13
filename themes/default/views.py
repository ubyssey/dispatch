from django.shortcuts import render_to_response
from apps.content.models import Article

def home(request):
    return render_to_response('index.html')

def article(request, section=False, slug=False):
    if slug and section:
        article = Article.objects.get(slug=slug, section__name=section)
    context = {
        'article': article
    }
    return render_to_response('article.html', context)
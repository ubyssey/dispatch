from django.http import HttpResponse
from apps.content.models import Article

def article(request, section=False, slug=False):
    if slug and section:
        article = Article.objects.get(slug=slug, section__name=section)
    html = "<html><body>%s</body></html>" % article.long_headline
    return HttpResponse(html)
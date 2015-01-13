from dispatch.apps.content.models import Article
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.admin.views.decorators import staff_member_required

@staff_member_required
def articles(request):
    return render_to_response(
        "admin/articles/list.html",
        {'article_list' : Article.objects.all()},
        RequestContext(request, {}),
    )
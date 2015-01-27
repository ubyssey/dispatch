from dispatch.apps.content.models import Article, Tag, Topic
from django.template import RequestContext
from django.shortcuts import render_to_response, render
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from dispatch.apps.core.models import User
from .forms import ArticleForm

@staff_member_required
def articles(request):
    return render_to_response(
        "admin/articles/list.html",
        {'article_list' : Article.objects.all()},
        RequestContext(request, {}),
    )


@login_required
def article_add(request):
    if request.method == 'POST':
        form = ArticleForm(request.POST)
        if form.is_valid():
            form.save()
            #tags = request.POST.get("tags-list", False)
            #if tags:
            #    a.add_tags(tags)
        else:
            print form.errors

    else:
        form = ArticleForm()

    #tags = ",".join(a.tags.values_list('name', flat=True))

    #images = a.images.all()
    #image_ids = ",".join([str(i) for i in a.images.values_list('id', flat=True)])

    user = User.objects.get(email=request.user)

    a = Article()
    a.authors.add("")

    context = {
        'article': a,
        'form': form,
        'tags': tags,
    }

    return render(request, 'admin/article/edit.html', context)

@login_required
def article_edit(request, id):
    a = Article.objects.get(pk=id)
    if request.method == 'POST':
        form = ArticleForm(request.POST, instance=a)
        if form.is_valid():
            form.save()
            tags = request.POST.get("tags-list", False)
            attachments = request.POST.get("attachment-list", False)
            if tags:
                a.add_tags(tags)
            if attachments:
                a.add_attachments(attachments)
        else:
            print form.errors

    else:
        form = ArticleForm(instance=a)

    tags = ",".join(a.tags.values_list('name', flat=True))

    images = a.images.all()
    image_ids = ",".join([str(i) for i in a.images.values_list('id', flat=True)])

    context = {
        'article': a,
        'form': form,
        'tags': tags,
    }

    return render(request, 'admin/article/edit.html', context)

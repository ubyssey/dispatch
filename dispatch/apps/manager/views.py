from dispatch.apps.content.models import Article, Tag, Topic, Author
from django.template import RequestContext
from django.shortcuts import render_to_response, render, redirect
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from dispatch.apps.core.models import User, Person
from datetime import datetime
from .forms import ArticleForm, FeaturedImageForm, ImageAttachmentFormSet

@staff_member_required
def section(request, section):
    return render_to_response(
        "admin/article/list.html",
        {
            'article_list' : Article.objects.filter(section__name__iexact=section,is_active=True,head=True).order_by('-published_at'),
            'section': section,
            'list_title': section,
        },
        RequestContext(request, {}),
    )

@staff_member_required
def articles(request):
    return render_to_response(
        "admin/article/list.html",
        {'article_list' : Article.objects.all()},
        RequestContext(request, {}),
    )

@staff_member_required
def article_add(request):
    saved = 0
    save_attempt = 0
    if request.method == 'POST':
        save_attempt = 1
        form = ArticleForm(request.POST)
        if form.is_valid():
            article = form.save()
            return redirect(article_edit, article.id)
        else:
            print form.errors
    else:
        form = ArticleForm()

    user = User.objects.get(email=request.user)

    p = Person.objects.get(user=user)

    context = {
        'person': p,
        'form': form,
        'authors_list': int(p.id),
        'saved': saved,
        'save_attempt': save_attempt,
    }

    return render(request, 'admin/article/edit.html', context)

@staff_member_required
def article_edit(request, id):
    a = Article.objects.filter(parent=id,preview=False).order_by('-pk')[0]
    saved = 0
    save_attempt = 0
    if request.method == 'POST':
        save_attempt = 1
        form = ArticleForm(request.POST, instance=a)
        if form.is_valid():
            a = form.save()
            saved = 1
            form = ArticleForm(instance=a)
        else:
            print form.errors
    else:
        form = ArticleForm(instance=a)

    context = {
        'article': a,
        'form': form,
        'authors_list': a.authors_list(),
        'saved': saved,
        'save_attempt': save_attempt,
    }

    return render(request, 'admin/article/edit.html', context)

@staff_member_required
def article_delete(request, id):
    article = Article.objects.get(pk=id)
    section_slug = article.section.slug
    article.is_active = False
    article.save(update_fields=['is_active'])
    return redirect(section, section_slug)

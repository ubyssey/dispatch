from dispatch.apps.content.models import Article, Tag, Topic, Author
from django.template import RequestContext
from django.shortcuts import render_to_response, render, redirect
from .decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from dispatch.apps.core.models import User, Person
from datetime import datetime
from .forms import ArticleForm, FeaturedImageForm, ImageAttachmentFormSet, PersonForm, ProfileForm
from dispatch.helpers import ThemeHelper
from django.contrib.auth.forms import AuthenticationForm

@staff_member_required
def home(request):
    users = Person.objects.all()
    q = request.GET.get('q', False)
    if q:
        users = users.filter(full_name__icontains=q)
    else:
        q = ""

    return render_to_response(
        "manager/base.html",
        {
            'persons' : users,
        },
        RequestContext(request, {}),
    )

def logout(request):
    from django.contrib.auth.views import logout
    return logout(request, template_name='registration/logged_out.html')

def login(request):
    from django.contrib.auth.views import login
    return login(request, template_name='manager/login.html')

@staff_member_required
def users(request):
    users = Person.objects.all()
    q = request.GET.get('q', False)
    if q:
        users = users.filter(full_name__icontains=q)
    else:
        q = ""

    return render_to_response(
        "manager/person/list.html",
        {
            'persons' : users,
            'list_title': 'People',
            'query': q,
        },
        RequestContext(request, {}),
    )

@staff_member_required
def user_edit(request, id):

    p = Person.objects.get(pk=id)

    if request.method == 'POST':
        form = PersonForm(request.POST, instance=p)
        if form.is_valid():
            form.save()
    else:
        form = PersonForm(instance=p)

    context = {
        'person': p,
        'form': form,
        'user_form': form.user_form,
    }

    return render(request, "manager/person/edit.html", context)

@staff_member_required
def profile(request):
    user = User.objects.get(email=request.user)
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
    else:
        form = ProfileForm(instance=user)

    context = {
        'user_form': form,
        'person_form': form.person_form,
    }

    return render(request, 'manager/profile.html', context)

@staff_member_required
def section(request, section):
    articles = Article.objects.filter(section__name__iexact=section,is_active=True,head=True).order_by('-published_at')
    q = request.GET.get('q', False)
    if q:
        articles = articles.filter(long_headline__icontains=q)
    else:
        q = ""

    return render_to_response(
        "manager/article/list.html",
        {
            'article_list' : articles,
            'unpublished': articles.filter(is_published=False).count(),
            'section': section,
            'list_title': section,
            'query': q,
        },
        RequestContext(request, {}),
    )

@staff_member_required
def articles(request):
    q = request.POST.get('q', False)
    articles = Article.objects.all()

    if q:
        articles = articles.filter(title__icontains=q)

    return render_to_response(
        "manager/article/list.html",
        {'article_list' : articles},
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
        form = ArticleForm()

    user = User.objects.get(email=request.user)

    context = {
        'person': user.person,
        'form': form,
        'authors_list': int(user.person.id),
        'saved': saved,
        'save_attempt': save_attempt,
    }

    return render(request, 'manager/article/edit.html', context)

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
        form = ArticleForm(instance=a)

    context = {
        'article': a,
        'form': form,
        'authors_list': a.authors_list(),
        'templates': ThemeHelper.get_theme_templates(),
        'saved': saved,
        'save_attempt': save_attempt,
    }

    return render(request, 'manager/article/edit.html', context)

@staff_member_required
def article_delete(request, id):
    article = Article.objects.get(pk=id)
    section_slug = article.section.slug
    article.is_active = False
    article.save(update_fields=['is_active'])
    return redirect(section, section_slug)

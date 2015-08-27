from dispatch.apps.content.models import Article, Section, Tag, Topic, Author
from django.template import RequestContext
from django.shortcuts import render_to_response, render, redirect
from .decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from dispatch.apps.core.models import User, Person
from datetime import datetime
from .forms import ArticleForm, FeaturedImageForm, ImageAttachmentFormSet, PersonForm, ProfileForm, SectionForm, RoleForm
from dispatch.helpers import ThemeHelper
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import Group, Permission

from dispatch.apps.frontend.models import Page, Component, ComponentField

@staff_member_required
def home(request):
    q = request.GET.get('q', False)
    if q:
        users = users.filter(full_name__icontains=q)
    else:
        q = ""

    return render_to_response(
        "manager/base.html",
        {
            'title': "Dashboard",
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
    users = Person.objects.filter(is_admin=True).order_by('full_name')
    q = request.GET.get('q', False)
    if q:
        users = users.filter(full_name__icontains=q)
    else:
        q = ""

    paginator = Paginator(users, 15) # Show 15 articles per page

    page = request.GET.get('page')

    try:
        persons = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        persons = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        persons = paginator.page(paginator.num_pages)

    return render_to_response(
        "manager/person/list.html",
        {
            'title': 'People',
            'persons' : persons,
            'list_title': 'People',
            'query': q,
        },
        RequestContext(request, {}),
    )

@staff_member_required
def user_add(request):

    if request.method == 'POST':
        form = PersonForm(request.POST, request.FILES, user_form=False)
        if form.is_valid():
            form.save()
            return redirect(users)
    else:
        form = PersonForm(user_form=False)

    context = {
        'title': 'Add User',
        'form': form,
        'user_form': form.user_form,
    }

    return render(request, "manager/person/edit.html", context)

@staff_member_required
def user_edit(request, id):

    p = Person.objects.get(pk=id)

    if request.method == 'POST':
        form = PersonForm(request.POST, request.FILES, instance=p)
        if form.is_valid():
            form.save()
            return redirect(users)
    else:
        form = PersonForm(instance=p)

    context = {
        'title': 'Edit User',
        'person': p,
        'form': form,
        'user_form': form.user_form,
    }

    return render(request, "manager/person/edit.html", context)

@staff_member_required
def profile(request):
    user = User.objects.get(email=request.user)
    if request.method == 'POST':
        form = ProfileForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
    else:
        form = ProfileForm(instance=user)

    context = {
        'title': user.person.full_name,
        'user_form': form,
        'person_form': form.person_form,
    }

    return render(request, 'manager/profile.html', context)

@staff_member_required
def roles(request):

    context = {
        'roles': Group.objects.all()
    }
    return render(request, 'manager/role/list.html', context)

@staff_member_required
def role_add(request):

    if request.method == 'POST':
        form = RoleForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect(roles)
    else:
        form = RoleForm()

    context = {
        'title': 'Add Role',
        'form': form,
    }

    return render(request, "manager/role/edit.html", context)

@staff_member_required
def role_edit(request, pk=None):

    role = Group.objects.get(pk=pk)

    if request.method == 'POST':
        form = RoleForm(request.POST, instance=role)
        if form.is_valid():
            form.save()
            return redirect(roles)
    else:
        form = RoleForm(instance=role)

    context = {
        'title': 'Edit Role',
        'form': form,
    }

    return render(request, "manager/role/edit.html", context)

@staff_member_required
def section(request, section):
    section = Section.objects.get(name=section)
    article_list = Article.objects.filter(section=section,is_active=True,head=True).order_by('-created_at')


    q = request.GET.get('q', False)
    if q:
        article_list = article_list.filter(long_headline__icontains=q)
    else:
        q = ""

    unpublished = article_list.exclude(status=Article.PUBLISHED).count()


    paginator = Paginator(article_list, 15) # Show 15 articles per page

    page = request.GET.get('page')

    try:
        articles = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        articles = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        articles = paginator.page(paginator.num_pages)

    return render_to_response(
        "manager/article/list.html",
        {
            'title': section,
            'article_list' : articles,
            'unpublished': unpublished,
            'section': section,
            'list_title': section,
            'query': q,
        },
        RequestContext(request, {}),
    )

@staff_member_required
def sections(request):

    sections = Section.objects.all()

    context = {
        'title': 'Sections',
        'sections': sections,
    }

    return render(request, 'manager/section/list.html', context)

@staff_member_required
def section_add(request):
    if request.method == 'POST':
        form = SectionForm(request.POST)
        if form.is_valid():
            section = form.save()
            return redirect(section_edit, section.id)
    else:
        form = SectionForm()

    context = {
        'title': 'Add Section',
        'form': form,
    }

    return render(request, 'manager/section/edit.html', context)

@staff_member_required
def section_edit(request, id):
    section = Section.objects.get(id=id)

    if request.method == 'POST':
        form = SectionForm(request.POST, instance=section)
        if form.is_valid():
            section = form.save()
    else:
        form = SectionForm(instance=section)

    context = {
        'title': 'Edit Section',
        'form': form,
    }

    return render(request, 'manager/section/edit.html', context)

@staff_member_required
def articles(request):
    q = request.POST.get('q', False)
    articles = Article.objects.all()

    if q:
        articles = articles.filter(title__icontains=q)

    return render_to_response(
        "manager/article/list.html",
        {
            'article_list' : articles
        },
        RequestContext(request, {}),
    )

@staff_member_required
def article_add(request):
    section_id = request.GET.get('section', False)
    try:
        section = Section.objects.get(pk=section_id)
    except:
        section = None
    return render(request, 'manager/article/edit.html', {'section': section})

@staff_member_required
def article_edit(request, id):
    """
    TODO: create API route to return article from parent ID eliminate below query.
    """

    context = {
        'title': 'Edit Article',
        'article': id,
        #'templates': ThemeHelper.get_theme_templates(),
    }

    return render(request, 'manager/article/edit.html', context)

@staff_member_required
def article_delete(request, id):
    article = Article.objects.get(pk=id)
    section_slug = article.section.slug
    article.is_active = False
    article.save(update_fields=['is_active'])
    return redirect(section, section_slug)

@staff_member_required
def page_edit(request, slug):

    pages = ThemeHelper.get_theme_pages()

    context = {
        'title': 'Edit Page',
        'page': pages.get(slug),
        'slug': slug,
    }

    return render(request, 'manager/page/edit.html', context)

@staff_member_required
def pages(request):

    pages = ThemeHelper.get_theme_pages()

    context = {
        'title': 'Pages',
        'pages': pages.all(),
    }

    return render(request, 'manager/page/list.html', context)
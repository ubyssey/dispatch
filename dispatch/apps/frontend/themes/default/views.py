from django.shortcuts import render, render_to_response, redirect
from django.http import Http404
from django.contrib.auth import authenticate, login, logout

from dispatch.apps.content.models import Article, Page
from .forms import RegistrationForm

class DefaultTheme():

    def home(self, request):
        return render_to_response('index.html')

    def article(self, request, section=None, slug=None):

        return None

    def page(self, request, slug=None):

        return None

    def section(self, request, section=None):

        return None

    def register(self, request):

        if request.method == 'POST':
            form = RegistrationForm(request.POST)
            if form.is_valid():
                form.save()
                new_user = authenticate(username=request.POST['email'], password=request.POST['password1'])
                login(request, new_user)
                return redirect(self.home)
        else:
            form = RegistrationForm()

        context = {
            'form': form,
        }

        return render(request, "register.html", context)

    def login(self, request):
        if request.method == 'POST':
            user = authenticate(username=request.POST['email'], password=request.POST['password'])
            login(request, user)
            return redirect(self.home)
        else:
           return render(request, "login.html")

    def logout(self, request):
        logout(request)
        return redirect(self.home)

    def find_article(self, request, slug, section=None):

        def _find_preview(slug, section=None):
            if section is not None:
                return Article.objects.get(slug=slug, section__slug=section, head=True)
            else:
                return Article.objects.get(slug=slug, head=True)

        def _find_published(slug, section=None):
            if section is not None:
                return Article.objects.get(slug=slug, section__slug=section, head=True, is_published=True)
            else:
                return Article.objects.get(slug=slug, head=True, is_published=True)

        if request.user.is_staff:
            try:
                article = _find_preview(slug, section)
            except Article.DoesNotExist:
                raise Http404("This article does not exist.")
        else:
            try:
                article = _find_published(slug, section)
            except Article.DoesNotExist:
                raise Http404("This article does not exist.")
        return article

    def find_page(self, request, slug):
        if request.user.is_staff:
            try:
                page = Page.objects.get(slug=slug, head=True)
            except Article.DoesNotExist:
                raise Http404("This page does not exist.")
        else:
            try:
                page = Page.objects.get(slug=slug, head=True, is_published=True)
            except Page.DoesNotExist:
                raise Http404("This page does not exist.")
        return page

    def article(self, request, section=False, slug=False):

        article = self.find_article(request, section, slug)

        context = {
            'article': article
        }

        return render(request, 'article.html', context)

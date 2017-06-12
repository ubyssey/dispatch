from django.shortcuts import render, render_to_response, redirect
from django.http import Http404
from django.contrib.auth import authenticate, login, logout

from dispatch.apps.content.models import Article, Page

class DefaultTheme:

    def home(self, request):
        return render_to_response('index.html')

    def article(self, request, section=None, slug=None):
        return

    def page(self, request, slug=None):
        return

    def section(self, request, section=None):
        return

    def find_article(self, request, slug, section=None):

        def _find_article(slug, section=None):
            if section is not None:
                return Article.objects.get(slug=slug, section__name=section, head=True)
            else:
                return Article.objects.get(slug=slug, head=True)

        if request.user.is_staff:
            try:
                article = _find_article(slug, section)
            except Article.DoesNotExist:
                raise Http404("This article does not exist.")
        else:
            try:
                article = _find_article(slug, section)
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

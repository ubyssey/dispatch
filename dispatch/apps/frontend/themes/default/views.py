from django.shortcuts import render, render_to_response, redirect
from django.http import Http404
from django.contrib.auth import authenticate, login, logout

from dispatch.apps.content.models import Article
from .forms import RegistrationForm

class DefaultTheme():

    def home(self, request):
        return render_to_response('index.html')

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
        return render(request, 'article.html', context)
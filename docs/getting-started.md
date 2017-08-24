# Installation

```bash
pip install dispatch
```

### From Source
```bash
git clone https://github.com/ubyssey/dispatch.git
cd dispatch/dispatch/static/manager

# build the front-end
yarn setup
yarn build

cd ../../..
python setup.py install
```

# Getting Started

Dispatch provides a layer on top of Django, so Django views and templating are still necessary to build your website. Please read the [Django documentation](https://docs.djangoproject.com/en/1.11/) for reference.

## Starting a New Dispatch Project

Start a new Django project,

```bash
django-admin startproject myproject
```

then configure it to use dispatch; add to your `settings.py` (changing the values as necessary to reflect the newly created project:

```python
DISPATCH_PROJECT_DIR = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..')
DISPATCH_PROJECT_MODULE = 'myproject'
```

Ensure that you have [configured a database](https://docs.djangoproject.com/en/1.11/ref/settings/#databases), and take a moment to review any other [settings that are relevant to your project. ](https://docs.djangoproject.com/en/1.11/ref/settings)

### Run migrations (apply database schema)

With a database configured
```bash
python manage.py makemigrations dispatch
python manage.py migrate
```

To apply the database schema.

### Creating a User

```bash
python manage.py createsuperuser
```

Enter an email and password for the user you wish to create.

### Starting the test server

```bash
python manage.py runserver
```

You should now be able to navigate to [http://localhost/admin](http://localhost/admin) and log in using the email and password you configured in the previous step.

For more information on how to use the manager, see [it's docs](./manager.md)

Note that if you go to [http://localhost/](http://localhost/), it won't work. You need to create some views!

## Using Dispatch Features in Your Project

### Creating a View

If you don't already know how, you can follow the [Django Tutorial here](https://docs.djangoproject.com/en/1.11/intro/tutorial03/#writing-more-views) to learn how to create a view and connect it to a url.

Once you have a view function, you can see the power of dispatch.

##### views.py

```python
from django.http import HttpResponse
from dispatch.apps.content.models import Article

def view_html_of_article(request):
  article = Article.objects.all()[0]  # dispatch models are just extended Django models!
  HttpResponse(article.html)
```

##### urls.py

```python
from django.conf.urls import include, url
from views import view_html_of_article

theme_urls = [
    url(r'^$', view_html_of_article, name='home'),
]
```

Ensure you create at least one article in the manager at [http://localhost/admin](http://localhost/admin) and visit the homepage you just configured, [http://localhost/](http://localhost/).

You should see the html of the article rendered. It needs CSS, and your homepage needs to show more than one article, but I hope you are starting to see how you could build it up around these tools!

You can also render articles from inside a [Django template](https://docs.djangoproject.com/en/1.11/topics/templates/).

##### views.py

```python
from django.shortcuts import render
from dispatch.apps.content.models import Article

def view_render_article_page(request):
  #  Get 5 recent, published articles
  articles = Article.objects.all().filter(is_published=True)[:5]

  render(request, 'article-page.html', {'articles': articles})
```

##### article-page.html

```html
<div class='my-article-page-wrapper'>
  {% for article in articles %}
  <div class='my-article-wrapper'>
    <div class='my-article-author'>By, {{ article.get_author_string }}</div>
    {{ article.html }}
  </div>
  {% endfor %}
</div>
```

To learn about the functionality of Article and other dispatch classes, see the [Dispatch Class Reference](./class-reference/)

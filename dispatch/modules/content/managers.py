# In Django, Some business logic ought to go in a _custom manager_, though one ought to be wary about overwriting manager behaviour.
# For example, it is often reasonable to create 
# https://docs.djangoproject.com/en/3.1/ref/models/instances/

from datetime import date
from dispatch.modules.content.models import Article
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Manager


class PublishableManager(Manager):
    def get(self, *args, **kwargs):
        """Get the latest article with the given primary key."""
        if 'pk' in kwargs:
            kwargs['parent'] = kwargs['pk']
            kwargs['head'] = True
            del kwargs['pk']

        return super(PublishableManager, self).get(*args, **kwargs)

    def get_current_breaking_qs(self, *args, **kwargs):
        """
        Returns breaking news stories _at a particular time_
        
        Used to create contexts

        @TODO: See if this can be readied BEFORE a request occurs!
        Can we cache a breaking article for the period it's breaking and have it check the cache?
        Or something
        """
        return self.filter(is_published=True, is_breaking=True, breaking_timeout__gte=timezone.now())  

class ArticleManager(PublishableManager):
    """
    
    """

    def create_article(self, *args, **kwargs):
        pass

    def set_all_article_metas(self, *args, **kwargs):
        """
        @TODO: Fix bad try-except
        """
        articles = self.all()

        for a in articles:
            meta = a.meta
            try:
                meta['image'] = a.featured_image.image.get_medium_url()
            except:
                meta['image'] = kwargs['default_image']

            meta['title'] = a.headline
            meta['description'] = a.seo_description if a.seo_description is not None else a.snippet
            meta['url'] = a.get_absolute_url
            meta['author'] = a.get_author_type_string()
            a.meta = meta


class PopularityListManager(Manager):
    
    def get_current_popular_articles(self, *args, **kwargs):
        try:
            return self.get(date=date.today())
        except ObjectDoesNotExist:
            return self.create_popularity_list(*args, **kwargs)

    def create_popularity_list(self, *args, **kwargs):
        """
        Creates a popularity list for the current time period.
        Costly.
        """

        if 'date' in kwargs:
            date = kwargs['date']
        else:
            date = date.today()

        durations = {
            'week': 7,
            'month': 30
        }

        if 'dur' in kwargs:
            dur = kwargs['dur']
        else:
            dur = 'week'

        articles = Article.objects.filter(is_published=True)

        if dur in durations:
            end = timezone.now() + timezone.timedelta(days=1)
            start = end - timezone.timedelta(days=durations[dur])
            time_range = (start, end)
            articles = articles.filter(published_at__range=(time_range))

        articles = articles.order_by('-views')

        return self.create(date=date, articles=articles)

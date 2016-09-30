import datetime

from django.db.models import Manager

class PublishableManager(Manager):

    def get(self, *args, **kwargs):
        if 'pk' in kwargs:
            kwargs['parent'] = kwargs['pk']
            kwargs['head'] = True
            del kwargs['pk']
        return super(PublishableManager, self).get(*args, **kwargs)

    def get_revision(self, *args, **kwargs):
        return super(PublishableManager, self).get(*args, **kwargs)

class ArticleManager(PublishableManager):

    def get_popular(self, dur='week'):

        durations = {
            'week': 7,
            'month': 30
        }

        articles = self.filter(is_published=True)

        if dur in durations:
            end = datetime.datetime.now() + datetime.timedelta(days=1)
            start = end - datetime.timedelta(days=durations[dur])
            time_range = (start, end)
            articles = articles.filter(created_at__range=(time_range))

        return articles.order_by('-views')

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

    def get_sections(self, exclude=[]):

        from dispatch.apps.content.models import Section

        results = {}

        sections = Section.objects.all()

        for section in sections:
            articles = self.exclude(id__in=exclude).filter(section=section,is_published=True).order_by('-published_at')[:5]
            if len(articles) > 0:
                results[section.slug] = {
                    'first': articles[0],
                    'stacked': articles[1:3],
                    'bullets': articles[3:],
                    'rest': articles[1:4],
                }

        return results

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

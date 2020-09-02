from django.utils import timezone
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


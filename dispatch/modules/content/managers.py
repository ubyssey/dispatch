import datetime

from django.db.models import Manager

class PublishableManager(Manager):
    def get(self, *args, **kwargs):
        """Get the latest article with the given primary key."""
        if 'pk' in kwargs:
            kwargs['parent'] = kwargs['pk']
            kwargs['head'] = True
            del kwargs['pk']

        return super(PublishableManager, self).get(*args, **kwargs)

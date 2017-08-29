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

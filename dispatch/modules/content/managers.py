import datetime

from django.db.models import Manager

class PublishableManager(Manager):
    def get(self, *args, **kwargs):
        """Get the latest article with the given primary key."""
        if 'pk' in kwargs:
            kwargs['parent'] = kwargs['pk']
            kwargs['head'] = True
            del kwargs['pk']

        """If the url requested includes the querystring parameters 'version' and 'preview_id',
        get the article with the specified version and preview_id.

        Otherwise, get the published version of the article.
        """

        if 'request' in kwargs:
	       	request = kwargs['request']
	       	version = request.GET.get('version', None)
	       	preview_id = request.GET.get('preview_id', None)

	       	if (version is not None) and (preview_id is not None):
	       		kwargs['revision_id'] = version
	       		kwargs['preview_id'] = preview_id
	       		del kwargs['is_published']

	       	del kwargs['request']

        return super(PublishableManager, self).get(*args, **kwargs)

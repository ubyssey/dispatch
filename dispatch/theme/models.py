from jsonfield import JSONField

from django.db.models import Model, SlugField

class Zone(Model):
    zone_id = SlugField(primary_key=True)
    widget_id = SlugField(null=True)
    data = JSONField(null=True)

from django.db.models import Model, ForeignKey, CharField, DateTimeField, PositiveIntegerField, CASCADE

from dispatch.modules.auth.models import User

class Action(Model):
    user = ForeignKey(User, on_delete=CASCADE)
    action = CharField(max_length=50)
    object_type = CharField(max_length=50)
    object_id = PositiveIntegerField()
    timestamp = DateTimeField(auto_now=True)

from django.contrib import admin
from dispatch.apps.frontend.models import Snippet, Script, Stylesheet

admin.site.register(Snippet)
admin.site.register(Script)
admin.site.register(Stylesheet)
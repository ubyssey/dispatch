from django.contrib import admin
from .models import User, Person, Contributor, ContributorType

class UserAdmin(admin.ModelAdmin):
    pass

admin.site.register(User)
admin.site.register(Person)
admin.site.register(Contributor)
admin.site.register(ContributorType)

from django.contrib import admin
from apps.content.models import Tag, Topic, Article, Section, Image

class ArticleAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("short_headline",)}

admin.site.register(Article, ArticleAdmin)

admin.site.register(Section)
admin.site.register(Image)
admin.site.register(Tag)
admin.site.register(Topic)

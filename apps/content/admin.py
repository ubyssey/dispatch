from django.contrib import admin
from apps.content.models import Article, Section, Image

class ArticleAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("short_headline",)}

admin.site.register(Article, ArticleAdmin)

admin.site.register(Section)
admin.site.register(Image)
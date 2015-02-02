from django.contrib import admin
from django import forms
from dispatch.apps.content.models import Tag, Topic, Article, Section, Image, Video


class ArticleForm(forms.ModelForm):

    class Meta:
        model = Article

class ImageInlineAdmin(admin.TabularInline):
    model = Article.images.through

class ArticleAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("short_headline",)}

    form = ArticleForm

    fieldsets = (
        ('Content', {
            'fields': ('long_headline', 'short_headline', 'content',)
        }),
        ('Basic', {
            'fields': ('published_at', 'section', 'importance', 'slug')
        }),
        ('', {
            'fields': ('topics', 'tags', 'shares',)
        }),
        ('Media', {
            'fields': ('videos',)
        }),
        ('Developer', {
            'fields': ('snippets', 'scripts', 'stylesheets',)
        }),
    )

    inlines = (ImageInlineAdmin,)

admin.site.register(Article, ArticleAdmin)
admin.site.register(Section)
admin.site.register(Image)
admin.site.register(Video)
admin.site.register(Tag)
admin.site.register(Topic)

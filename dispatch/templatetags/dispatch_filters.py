from django import template
from django.conf import settings
register = template.Library()
import re

@register.filter(name='youtube_embed_id')
# converts youtube URL into embed HTML
def youtube_embed_id(url):
    urlParts = url.split("?v=")
    if len(urlParts) > 1:
        # embed_url = 'https://www.youtube.com/embed/%s' %(match.group(2))
        return urlParts[1]
    return ''

@register.filter(name='youtube_embed_url')
# converts youtube URL into embed HTML
def youtube_embed_url(url):
    urlParts = url.split("?v=")
    if len(urlParts) > 1:
        embed_url = 'https://www.youtube.com/embed/%s' %(urlParts[1])
        
        return embed_url
    return ''

youtube_embed_url.is_safe = True
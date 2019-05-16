from django import template
from django.conf import settings
register = template.Library()
import re

@register.filter(name='youtube_embed_id')
# converts youtube URL into embed HTML
# value is url
def youtube_embed_id(value):
    match = re.search(r'^(http|https)\:\/\/www\.youtube\.com\/watch\?v\=(\w*)(\&(.*))?$', value)
    if match:
        # embed_url = 'http://www.youtube.com/embed/%s' %(match.group(2))
        return match.group(2)
    return ''

@register.filter(name='youtube_embed_url')
# converts youtube URL into embed HTML
def youtube_embed_url(url):
    match = re.search(r'^(http|https)\:\/\/www\.youtube\.com\/watch\?v\=(\w*)(\&(.*))?$', url)
    if match:
        embed_url = 'http://www.youtube.com/embed/%s' %(match.group(2))
        return embed_url
    return ''

youtube_embed_url.is_safe = True
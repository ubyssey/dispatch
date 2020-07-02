from django import template
from django.conf import settings
register = template.Library()
import re

@register.filter(name='youtube_embed_id')
# converts youtube URL into embed HTML
def youtube_embed_id(url):
    youtube_regex = re.compile(r'(https?://)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)/(watch\?v=|embed/|v/|.+\?v=)?(?P<id>[A-Za-z0-9\-=_]{11})')
    match = youtube_regex.match(url)
    if match:
        return match.group('id')        
    return ''

@register.filter(name='youtube_embed_url')
# converts youtube URL into embed HTML
def youtube_embed_url(url):
    youtube_regex = re.compile(r'(https?://)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)/(watch\?v=|embed/|v/|.+\?v=)?(?P<id>[A-Za-z0-9\-=_]{11})')
    match = youtube_regex.match(url)
    if match:
        embed_url = 'https://www.youtube.com/embed/%s' %(match.group('id'))
        
        return embed_url
    return ''

youtube_embed_url.is_safe = True
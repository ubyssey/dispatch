from django.shortcuts import render
from django.http import HttpResponse
import json

from .helpers import generate_frontpage

def api_frontpage(request):

    # Fetch frontpage stories
    stories = generate_frontpage().values('id', 'long_headline', 'content', 'importance')

    return HttpResponse(json.dumps(list(stories)), content_type="application/json")
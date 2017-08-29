from django.conf.urls import url
from django.shortcuts import render_to_response

def admin(request):
    """Render HTML entry point for manager app."""
    return render_to_response('manager/index.html')

urlpatterns = [url(r'/?.*/', admin, name='dispatch-admin')]

from django.urls import re_path
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.shortcuts import render
from dispatch.admin import views
import dispatch

def admin(request):
    """Render HTML entry point for manager app."""
    context = {
        'api_url': settings.API_URL,
        'app_js_bundle': 'manager/dispatch/manager.js',
        'app_css_bundle': 'manager/dispatch/manager.css'
        #TODO: figure out if the namespace 'dispatch' should go in here or in the html template
    }
    
    return render(request, 'manager/index.html', context)

urlpatterns = [
    re_path(r'signup/(?P<uuid>[0-9a-f-]+)/', views.signup, name='dispatch-signup'),
    re_path(r'reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})',
        auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    re_path(r'reset/done', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    re_path(r'.*', admin, name='dispatch-admin')
]

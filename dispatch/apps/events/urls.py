from django.conf.urls import url

from dispatch.apps.events import views

urlpatterns = [
    url(r'^submit/form/', views.submit_form, name='events-submit-form'),
    url(r'^submit/success/', views.submit_success, name='events-submit-success'),
    url(r'^submit/$', views.submit_landing, name='events-submit-landing'),
]

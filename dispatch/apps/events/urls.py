from django.conf.urls import url

from dispatch.apps.events import views

urlpatterns = [
    url(r'^submit/', views.submit),
    url(r'^form/', views.form),
    url(r'^success/', views.success),
]

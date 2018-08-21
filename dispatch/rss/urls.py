from django.conf.urls import url
from dispatch.rss import views

urlpatterns = [
    url(r'^podcasts/(?P<slug>[-\w]+)/', views.podcast, name='rss'),
]

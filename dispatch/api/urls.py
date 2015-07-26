from django.conf.urls import url

from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from dispatch.apps.api import views

router = routers.DefaultRouter()

router.register(r'articles', views.ArticleViewSet, base_name='articles')
router.register(r'frontpage', views.FrontpageViewSet, base_name='frontpage')
router.register(r'sections', views.SectionViewSet, base_name='sections')
router.register(r'people', views.PersonViewSet, base_name='people')
router.register(r'tags', views.TagViewSet, base_name='tags')
router.register(r'images', views.ImageViewSet, base_name='images')
router.register(r'galleries', views.ImageGalleryViewSet, base_name='galleries')
router.register(r'templates', views.TemplateViewSet, base_name='templates')

section_frontpage = views.SectionViewSet.as_view({
    'get': 'frontpage',
})

component = views.ComponentViewSet.as_view({
    'get': 'detail',
    'post': 'update',
})

urlpatterns = format_suffix_patterns([
    # Extra section routes
    url(r'^sections/(?P<pk>[0-9]+)/frontpage/$', section_frontpage, name='section-frontpage'),
    url(r'^sections/(?P<slug>[\w-]+)/frontpage/$', section_frontpage, name='section-frontpage'),
    # Components route
    url(r'^components/(?P<slug>[\w-]+)/$', component, name='component'),
]) + router.urls
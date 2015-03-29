from django.conf.urls import url
from rest_framework import routers
from dispatch.apps.api import views

router = routers.DefaultRouter()

router.register(r'articles', views.ArticleViewSet, base_name='articles')

router.register(r'frontpage', views.FrontpageViewSet, base_name='frontpage')

router.register(r'users', views.UserViewSet)
router.register(r'person', views.PersonViewSet, base_name='person')

#router.register(r'sections', views.SectionViewSet)

router.register(r'tag', views.TagViewSet)
router.register(r'images', views.ImageViewSet, base_name='images')
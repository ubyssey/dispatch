from django.conf.urls import patterns, include, url
from rest_framework import routers
from dispatch.apps.api import views
from dispatch.helpers import ThemeHelper
from dispatch.apps.content import views as content_views
from dispatch.apps.manager import urls as adminurls

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'person', views.PersonViewSet)
router.register(r'articles', views.ArticleViewSet)
router.register(r'tag', views.TagViewSet)
router.register(r'image', views.ImageViewSet)
router.register(r'attachment', views.AttachmentViewSet)
router.register(r'article/attachments', views.AttachmentImageViewSet)

urlpatterns = patterns('',
    url(r'^admin/', include(adminurls)),
    url(r'^api/', include(router.urls)),
    url(r'^api/frontpage/?', 'dispatch.apps.content.views.api_frontpage'),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^', include(ThemeHelper.get_theme_urls())),
)
from django.conf.urls import url

from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from dispatch.api import views

router = routers.DefaultRouter()

router.register(r'articles', views.ArticleViewSet, base_name='api-articles')
router.register(r'pages', views.PageViewSet, base_name='api-pages')
router.register(r'sections', views.SectionViewSet, base_name='api-sections')
router.register(r'persons', views.PersonViewSet, base_name='api-persons')
router.register(r'users', views.UserViewSet, base_name='api-users')
router.register(r'tags', views.TagViewSet, base_name='api-tags')
router.register(r'topics', views.TopicViewSet, base_name='api-topics')
router.register(r'images', views.ImageViewSet, base_name='api-images')
router.register(r'galleries', views.ImageGalleryViewSet, base_name='api-galleries')
router.register(r'templates', views.TemplateViewSet, base_name='api-templates')
router.register(r'dashboard', views.DashboardViewSet, base_name='api-dashboard')
router.register(r'integrations', views.IntegrationViewSet, base_name='api-integrations')
router.register(r'files',views.FileViewSet, base_name='api-files')
router.register(r'issues',views.IssueViewSet, base_name='api-issues')
router.register(r'zones', views.ZoneViewSet, base_name='api-zones')
router.register(r'token', views.TokenViewSet, base_name='api-token')
router.register(r'videos', views.VideoViewSet, base_name='api-videos')
router.register(r'invites', views.InviteViewSet, base_name='api-invites')
router.register(r'polls', views.PollViewSet, base_name='api-polls')

dashboard_recent_articles = views.DashboardViewSet.as_view({'get': 'list_recent_articles'})
dashboard_user_actions = views.DashboardViewSet.as_view({'get': 'list_actions'})

urlpatterns = format_suffix_patterns([
    # Dashboard routes
    url(r'^dashboard/recent', dashboard_recent_articles, name='dashboard_recent_articles'),
    url(r'^dashboard/actions', dashboard_user_actions, name='dashboard_user_actions')
]) + router.urls

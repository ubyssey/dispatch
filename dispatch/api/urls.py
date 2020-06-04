from django.urls import re_path

from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from dispatch.api import views

router = routers.DefaultRouter()

router.register(r'articles', views.ArticleViewSet, basename='api-articles')
router.register(r'pages', views.PageViewSet, basename='api-pages')
router.register(r'sections', views.SectionViewSet, basename='api-sections')
router.register(r'persons', views.PersonViewSet, basename='api-persons')
router.register(r'users', views.UserViewSet, basename='api-users')
router.register(r'tags', views.TagViewSet, basename='api-tags')
router.register(r'topics', views.TopicViewSet, basename='api-topics')
router.register(r'images', views.ImageViewSet, basename='api-images')
router.register(r'galleries', views.ImageGalleryViewSet, basename='api-galleries')
router.register(r'templates', views.TemplateViewSet, basename='api-templates')
router.register(r'dashboard', views.DashboardViewSet, basename='api-dashboard')
router.register(r'integrations', views.IntegrationViewSet, basename='api-integrations')
router.register(r'files',views.FileViewSet, basename='api-files')
router.register(r'issues',views.IssueViewSet, basename='api-issues')
router.register(r'zones', views.ZoneViewSet, basename='api-zones')
router.register(r'token', views.TokenViewSet, basename='api-token')
router.register(r'videos', views.VideoViewSet, basename='api-videos')
router.register(r'invites', views.InviteViewSet, basename='api-invites')
router.register(r'polls', views.PollViewSet, basename='api-polls')
router.register(r'subsections', views.SubsectionViewSet, basename='api-subsections')
router.register(r'podcasts/podcasts', views.PodcastViewSet, basename='api-podcasts')
router.register(r'podcasts/episodes', views.PodcastEpisodeViewSet, basename='api-podcast-episodes')

dashboard_recent_articles = views.DashboardViewSet.as_view({'get': 'list_recent_articles'})
dashboard_user_actions = views.DashboardViewSet.as_view({'get': 'list_actions'})

urlpatterns = format_suffix_patterns([
    # Dashboard routes
    re_path(r'^dashboard/recent', dashboard_recent_articles, name='dashboard_recent_articles'),
    re_path(r'^dashboard/actions', dashboard_user_actions, name='dashboard_user_actions')
]) + router.urls

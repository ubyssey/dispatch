from django.conf.urls import url, include

from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from dispatch.apps.api import views

router = routers.DefaultRouter()

router.register(r'articles', views.ArticleViewSet, base_name='api-articles')
router.register(r'pages', views.PageViewSet, base_name='api-pages')
router.register(r'sections', views.SectionViewSet, base_name='api-sections')
router.register(r'people', views.PersonViewSet, base_name='api-people')
router.register(r'tags', views.TagViewSet, base_name='api-tags')
router.register(r'topics', views.TopicViewSet, base_name='api-topics')
router.register(r'images', views.ImageViewSet, base_name='api-images')
router.register(r'galleries', views.ImageGalleryViewSet, base_name='api-galleries')
router.register(r'templates', views.TemplateViewSet, base_name='api-templates')
router.register(r'dashboard', views.DashboardViewSet, base_name='api-dashboard')
router.register(r'integrations', views.IntegrationViewSet, base_name='api-integrations')

component = views.ComponentViewSet.as_view({
    'get': 'detail',
    'post': 'update',
})

person_bulk_delete = views.PersonViewSet.as_view({ 'post': 'bulk_delete' })

article_bulk_delete = views.ArticleViewSet.as_view({ 'post': 'bulk_delete' })

dashboard_recent_articles = views.DashboardViewSet.as_view({ 'get': 'list_recent_articles'})
dashboard_user_actions = views.DashboardViewSet.as_view({ 'get': 'list_actions'})

urlpatterns = format_suffix_patterns([
    # Components route
    url(r'^components/(?P<slug>[\w-]+)/$', component, name='component'),
    # People route
    url(r'^people/delete/$', person_bulk_delete, name='person-bulk-delete'),
    # Article routes
    url(r'^articles/delete/$', article_bulk_delete, name='article-bulk-delete'),
    # Dashboard routes
    url(r'^dashboard/recent', dashboard_recent_articles, name='dashboard_recent_articles'),
    url(r'^dashboard/actions', dashboard_user_actions, name='dashboard_user_actions'),
    # User authorization
    url(r'^auth/token', views.user_authenticate, name='user-token'),
]) + router.urls

from django.conf.urls import url, include

from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from dispatch.apps.api import views

router = routers.DefaultRouter()

router.register(r'articles', views.ArticleViewSet, base_name='api-articles')
router.register(r'pages', views.PageViewSet, base_name='api-pages')
router.register(r'frontpage', views.FrontpageViewSet, base_name='api-frontpage')
router.register(r'sections', views.SectionViewSet, base_name='api-sections')
router.register(r'people', views.PersonViewSet, base_name='api-people')
router.register(r'tags', views.TagViewSet, base_name='api-tags')
router.register(r'topics', views.TopicViewSet, base_name='api-topics')
router.register(r'images', views.ImageViewSet, base_name='api-images')
router.register(r'galleries', views.ImageGalleryViewSet, base_name='api-galleries')
router.register(r'templates', views.TemplateViewSet, base_name='api-templates')
router.register(r'comments', views.CommentViewSet, base_name='api-comments')
router.register(r'trending', views.TrendingViewSet, base_name='api-trending')
router.register(r'dashboard', views.DashboardViewSet, base_name='api-dashboard')

section_frontpage = views.SectionViewSet.as_view({ 'get': 'frontpage' })

topic_articles = views.TopicViewSet.as_view({ 'get': 'articles' })

component = views.ComponentViewSet.as_view({
    'get': 'detail',
    'post': 'update',
})

person_bulk_delete = views.PersonViewSet.as_view({ 'post': 'bulk_delete' })

article_bulk_delete = views.ArticleViewSet.as_view({ 'post': 'bulk_delete' })
article_comments = views.CommentViewSet.as_view({ 'get': 'article' })

dashboard_recent_articles = views.DashboardViewSet.as_view({ 'get': 'list_recent_articles'})
dashboard_user_actions = views.DashboardViewSet.as_view({ 'get': 'list_actions'})

authentication_management = views.AuthenticationViewSet.as_view({
    'post': 'user_authenticate',
    'delete': 'user_unauthenticate'
})

urlpatterns = format_suffix_patterns([
    # Extra section routes
    url(r'^sections/(?P<pk>[0-9]+)/frontpage/$', section_frontpage, name='section-frontpage'),
    url(r'^sections/(?P<slug>[\w-]+)/frontpage/$', section_frontpage, name='section-frontpage'),
    # Extra topic route
    url(r'^topics/(?P<pk>[0-9]+)/articles/$', topic_articles, name='topic-frontpage'),
    # Components route
    url(r'^components/(?P<slug>[\w-]+)/$', component, name='component'),
    # People route
    url(r'^people/delete/$', person_bulk_delete, name='person-bulk-delete'),
    # Article routes
    url(r'^articles/delete/$', article_bulk_delete, name='article-bulk-delete'),
    url(r'^articles/(?P<pk>[0-9]+)/comments/$', article_comments, name='article-comments'),
    # Dashboard routes
    url(r'^dashboard/recent', dashboard_recent_articles, name='dashboard_recent_articles'),
    url(r'^dashboard/actions', dashboard_user_actions, name='dashboard_user_actions'),
    # User authorization
    url(r'^auth/token', authentication_management, name='authentication_management'),
]) + router.urls

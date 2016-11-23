from django.conf.urls import include, url
from dispatch.apps.manager import views

urlpatterns = [
    url(r'^$', views.home, name='home'),

    url(r'^logout/?$', views.logout, name='logout'),
    url(r'^login/?$', views.login, name='login'),
    url(r'^profile/?$', views.profile, name='profile'),

    url(r'^users/$', views.users, name='users'),
    url(r'^user/(\d*)/$', views.user_edit, name='user_edit'),
    url(r'^user/add/?$', views.user_add, name='user_add'),

    url(r'^roles/$', views.roles, name='roles'),
    url(r'^roles/add/?$', views.role_add, name='roles_add'),
    url(r'^roles/edit/(\d*)/?$', views.role_edit, name='roles_edit'),

    url(r'^articles/$', views.articles, name='articles'),
    url(r'^article/(\d*)/$', views.article_edit, name='article_edit'),
    url(r'^article/delete/(\d*)/?$', views.article_delete, name='article_delete'),
    url(r'^article/add/(?P<section>[-\w]+)/?$', views.article_add, name='article_add'),
    url(r'^article/add/?$', views.article_add, name='article_add'),

    url(r'^pages/$', views.pages, name='pages'),
    url(r'^page/add/?$', views.page_add, name='page_add'),
    url(r'^page/(\d*)/$', views.page_edit, name='page_edit'),

    url(r'^section/edit/(\d*)/?$', views.section_edit, name='section_edit'),
    url(r'^section/add/?$', views.section_add, name='section_add'),
    url(r'^section/(?P<section>[-\w]+)/?$', views.section, name='section'),
    url(r'^sections/$', views.sections, name='sections'),

    url(r'^files/edit/(\d*)/?$', views.file_edit, name='file_edit'),
    url(r'^files/add/?$', views.file_add, name='file_add'),
    url(r'^files/delete/(\d*)/?$', views.file_delete, name='file_delete'),
    url(r'^files/$', views.files, name='files'),

    url(r'^components/$', views.components, name='components'),
    url(r'^component/edit/(?P<slug>[-\w]+)/?$', views.component_edit, name='component_edit'),
]

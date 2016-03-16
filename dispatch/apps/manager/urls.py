from django.conf.urls import patterns, include, url
from dispatch.apps.manager import views

urlpatterns = patterns('',
    url(r'^$', views.home),

    url(r'^logout/?$', views.logout),
    url(r'^login/?$', views.login),
    url(r'^profile/?$', views.profile),

    url(r'^users/$', views.users),
    url(r'^user/(\d*)/$', views.user_edit),
    url(r'^user/add/?$', views.user_add),

    url(r'^roles/$', views.roles),
    url(r'^roles/add/?$', views.role_add),
    url(r'^roles/edit/(\d*)/?$', views.role_edit),

    url(r'^articles/$', views.articles),
    url(r'^article/(\d*)/$', views.article_edit),
    url(r'^article/delete/(\d*)/?$', views.article_delete),
    url(r'^article/add/(?P<section>[-\w]+)/?$', views.article_add),
    url(r'^article/add/?$', views.article_add),

    url(r'^pages/$', views.pages),
    url(r'^page/add/?$', views.page_add),
    url(r'^page/(\d*)/$', views.page_edit),

    url(r'^section/edit/(\d*)/?$', views.section_edit),
    url(r'^section/add/?$', views.section_add),
    url(r'^section/(?P<section>[-\w]+)/?$', views.section),
    url(r'^sections/$', views.sections),

    url(r'^files/edit/(\d*)/?$', views.file_edit),
    url(r'^files/add/?$', views.file_add),
    url(r'^files/delete/(\d*)/?$', views.file_delete),
    url(r'^files/$', views.files),

    url(r'^components/$', views.components),
    url(r'^component/edit/(?P<slug>[-\w]+)/?$', views.component_edit),
)

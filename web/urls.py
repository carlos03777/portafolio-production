# web/urls.py
from django.urls import path
from . import views

app_name = 'web'

urlpatterns = [
    path('', views.home, name='home'),
    path('projects/', views.home, name='projects'),
    path('projects/<slug:slug>/', views.project_detail, name='project_detail'),
    # path('about/', views.about_detail, name='about'),
    path('about/', views.about, name='about'),
    path('en-desarrollo/', views.under_construction, name='under_construction'),

]

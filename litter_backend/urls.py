"""
URL configuration for litter_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from litter_app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('trash-posts/', views.create_trash_post, name='create_trash_post'),
    path('trash-posts/<int:post_id>/', views.get_trash_post, name='get_trash_post_detail'),
    path('trash-posts/clean/<int:post_id>', views.update_trash_post, name='update_trash_post'),
    path('trash-posts/list/', views.read_trash_posts, name='read_trash_posts'),
    path('rewards/', views.get_rewards, name='get_rewards'),
    path('locations/', views.get_locations, name='get_locations'),
]

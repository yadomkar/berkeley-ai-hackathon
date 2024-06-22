from django.urls import path
from . import views

urlpatterns = [
    path('trash-posts/', views.create_trash_post, name='create_trash_post'),
    path('trash-posts/<int:post_id>/', views.get_trash_post, name='get_trash_post_detail'),
    path('trash-posts/<int:post_id>/clean', views.update_trash_post, name='update_trash_post'),
    path('trash-posts/list/', views.read_trash_posts, name='read_trash_posts'),
    # Add other endpoints here if needed
]

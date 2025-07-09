from django.urls import path
from . import views

urlpatterns = [
    path('todos/', views.TodoList.as_view(), name='todo-list'),
    path('todos/<int:pk>/', views.TodoDetail.as_view(), name='todo-detail'),
]
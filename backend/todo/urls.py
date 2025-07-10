from django.urls import path
from .views import TodoList, TodoDetail, CSVImportView, ExportTodosView, LoginView, LogoutView, SignupView


urlpatterns = [
path('signup/', SignupView.as_view(), name='api-signup'),
path('login/', LoginView.as_view(), name='api-login'),
    path('logout/', LogoutView.as_view(), name='api-logout'),
    path('todos/', TodoList.as_view()),
    path('todos/<int:pk>/', TodoDetail.as_view()),
    path('import-csv/', CSVImportView.as_view(), name='import-csv'),
    path('todos/export/<str:format>/', ExportTodosView.as_view()),  # json, csv, raw, sql
    path('todos/<int:pk>/', TodoDetail.as_view(), name='todo-detail'),
    path('api/todos/', TodoList.as_view()),


]

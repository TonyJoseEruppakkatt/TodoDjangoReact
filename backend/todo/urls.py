from django.urls import path
from .views import TodoList, TodoDetail, CSVImportView, ExportTodosView


urlpatterns = [
    path('todos/', TodoList.as_view()),
    path('todos/<int:pk>/', TodoDetail.as_view()),
    path('todos/import/', CSVImportView.as_view()),
    path('api/import-csv/', CSVImportView.as_view(), name='import-csv'),
    path('todos/export/<str:format>/', ExportTodosView.as_view()),  # json, csv, raw, sql
    path('api/todos/<int:pk>/', TodoDetail.as_view(), name='todo-detail'),

]

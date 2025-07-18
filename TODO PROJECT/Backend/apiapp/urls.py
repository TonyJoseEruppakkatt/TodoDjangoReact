from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    path('add-task/', views.add_task, name='add_task'),
    path('tasks/', views.list_tasks, name='list_tasks'),
    path('tasks/<int:pk>/', views.view_task, name='view_task'),
    path('tasks/<int:pk>/edit/', views.edit_task, name='edit_task'),
    path('tasks/<int:pk>/delete/', views.delete_task, name='delete_task'),

    path('filter/', views.filter_tasks, name='filter_tasks'),

    path('import-csv/', views.import_csv, name='import_csv'),
    # path('export/<str:format>/', views.export_tasks, name='export_tasks'),
    path('export/csv/', views.export_csv, name='export_csv'),
    path('export/json/', views.export_json, name='export_json'),
    path('export/text/', views.export_text, name='export_text'),
    path('export/sql/', views.export_sql, name='export_sql'),
]

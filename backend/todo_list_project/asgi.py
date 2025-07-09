"""
ASGI configuration for the Django project.
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todo_list_project.settings')

application = get_asgi_application()
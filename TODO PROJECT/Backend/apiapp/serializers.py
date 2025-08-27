from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    # ✅ Map username from the related User model
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Task
        fields = ["id", "username", "title", "description", "due_date", "completed"]

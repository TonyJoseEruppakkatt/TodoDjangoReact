from django.core.exceptions import ValidationError
from django.utils import timezone
from django.db import models  # ✅ This import is required
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.db import models

# class Todo(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     title = models.CharField(max_length=200)
#     completed = models.BooleanField(default=False)
#     due_date = models.DateField(null=True, blank=True)


#     def clean(self):
#         if self.due_date and self.due_date < timezone.now().date():
#             raise ValidationError("Due date cannot be in the past.")

#     def __str__(self):
#         return self.title

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateTimeField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_premium = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()


class UserActivity(models.Model):
    ACTION_CHOICES = [
        ("ADD", "Task Added"),
        ("DELETE", "Task Deleted"),
        ("EDIT", "Task Edited"),
        ("COMPLETE", "Task Completed"),
        ("IMPORT", "Task Imported"),
        ("EXPORT", "Task Exported"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.timestamp}"
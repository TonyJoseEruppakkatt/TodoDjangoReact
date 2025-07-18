from django.test import TestCase
from .models import Todo

class TodoModelTest(TestCase):

    def setUp(self):
        Todo.objects.create(title="Test Todo", completed=False)

    def test_todo_creation(self):
        todo = Todo.objects.get(title="Test Todo")
        self.assertEqual(todo.title, "Test Todo")
        self.assertFalse(todo.completed)

import csv
from rest_framework import generics, filters
from .models import Todo
from .serializers import TodoSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils.csv_import import import_csv
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import MultiPartParser, FormParser  

class TodoList(generics.ListCreateAPIView):
    queryset = Todo.objects.all().order_by('-created_at')
    serializer_class = TodoSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title']
    filterset_fields = ['completed']  # allows ?completed=true/false

class TodoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    
class TodoList(generics.ListCreateAPIView): 
    queryset = Todo.objects.order_by('-id')  # or 'due_date' or any stable field
    serializer_class = TodoSerializer

    def perform_create(self, serializer):
        print("Creating TODO with data:", self.request.data)
        serializer.save()


class CSVImportView(APIView):
    parser_classes = [MultiPartParser, FormParser]  # ✅ required to handle files

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file uploaded'}, status=400)
        try:
            import_csv(file)
            return Response({'success': 'Todos imported successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=400)
class ExportTodosView(APIView):
    def get(self, request, format=None):
        todos = Todo.objects.all()
        if format == 'json':
            data = TodoSerializer(todos, many=True).data
            return JsonResponse(data, safe=False)

        elif format == 'csv':
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="todos.csv"'
            writer = csv.writer(response)
            writer.writerow(['title', 'description', 'completed', 'due_date'])
            for todo in todos:
                writer.writerow([todo.title, todo.description, todo.completed, todo.due_date])
            return response

        elif format == 'raw':
            data = "\n".join([todo.title for todo in todos])
            return HttpResponse(data, content_type='text/plain')

        elif format == 'sql':
            sql = "\n".join([
                f"INSERT INTO todos_todo (title, description, completed, due_date, created_at, updated_at) "
                f"VALUES ('{todo.title}', '{todo.description}', {int(todo.completed)}, '{todo.due_date}', "
                f"'{todo.created_at}', '{todo.updated_at}');"
                for todo in todos
            ])
            return HttpResponse(sql, content_type='text/plain')

        return Response({'error': 'Unsupported format'}, status=400)
  
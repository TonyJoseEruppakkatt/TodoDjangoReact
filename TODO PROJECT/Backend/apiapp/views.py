from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import Task
from .serializers import TaskSerializer
from django.http import HttpResponse
from rest_framework.parsers import MultiPartParser, FormParser
import csv
from rest_framework.authtoken.models import Token

# ✅ Auth Views

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    email = request.data.get('email')
    username = request.data.get('username')
    password = request.data.get('password')

    if not all([email, username, password]):
        return Response({'error': 'All fields are required'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)

    User.objects.create_user(username=username, email=email, password=password)
    return Response({'message': 'User created successfully'})


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})


# ✅ CRUD Task Views

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_task(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_tasks(request):
    tasks = Task.objects.filter(user=request.user).order_by('-id')
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_task(request, pk):
    task = get_object_or_404(Task, pk=pk, user=request.user)
    serializer = TaskSerializer(task)
    return Response(serializer.data)


@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def edit_task(request, pk):
    task = get_object_or_404(Task, pk=pk, user=request.user)
    serializer = TaskSerializer(task, data=request.data, partial=True)  # ✅ important
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_task(request, pk):
    task = get_object_or_404(Task, pk=pk, user=request.user)
    task.delete()
    return Response({'message': 'Task deleted'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def filter_tasks(request):
    status_param = request.GET.get('completed')
    if status_param is None:
        return Response({'error': 'Missing "completed" query parameter'}, status=400)
    completed = status_param.lower() == 'true'
    tasks = Task.objects.filter(user=request.user, completed=completed)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


# ✅ CSV Import / Export

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def import_csv(request):
    csv_file = request.FILES.get('file')
    if not csv_file or not csv_file.name.endswith('.csv'):
        return Response({'error': 'Upload a valid CSV file'}, status=400)

    decoded_file = csv_file.read().decode('utf-8').splitlines()
    reader = csv.DictReader(decoded_file)

    for row in reader:
        Task.objects.create(
            user=request.user,
            title=row.get('title', ''),
            description=row.get('description', ''),
            due_date=row.get('due_date'),
            completed=row.get('completed', '').lower() == 'true'
        )
    return Response({'message': 'Tasks imported successfully'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_tasks(request, format):
    tasks = Task.objects.filter(user=request.user)

    if format == 'csv':
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="tasks.csv"'
        writer = csv.writer(response)
        writer.writerow(['id', 'title', 'description', 'due_date', 'completed'])

        for task in tasks:
            writer.writerow([task.id, task.title, task.description, task.due_date, task.completed])
        return response

    return Response({'error': 'Unsupported format'}, status=400)

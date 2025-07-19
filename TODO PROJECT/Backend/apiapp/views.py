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
import json
from rest_framework.authtoken.models import Token
from django.http import JsonResponse

# ✅ Auth Views

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not all([username, password]):
        return Response({'error': 'Username and password are required'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)

    User.objects.create_user(username=username, password=password)
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


from rest_framework.pagination import PageNumberPagination

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_tasks(request):
    user = request.user
    search = request.GET.get('search', '')
    completed = request.GET.get('completed', None)

    tasks = Task.objects.filter(user=user).order_by('due_date')

    if search:
        tasks = tasks.filter(title__icontains=search)

    if completed is not None:
        tasks = tasks.filter(completed=completed in ['true', 'True', '1'])

    paginator = PageNumberPagination()
    paginator.page_size = 5
    result_page = paginator.paginate_queryset(tasks, request)
    serializer = TaskSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)



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
@parser_classes([MultiPartParser])
def import_csv(request):
    file = request.FILES.get('file')

    if not file.name.endswith('.csv'):
        return JsonResponse({'error': 'Invalid file format'}, status=400)

    decoded_file = file.read().decode('utf-8').splitlines()
    reader = csv.DictReader(decoded_file)

    for row in reader:
        Task.objects.create(
            user=request.user,
            title=row.get('title', ''),
            description=row.get('description', ''),
            due_date=row.get('due_date') or None,
            completed=row.get('completed', '').lower() in ['true', '1', 'yes']
        )

    return JsonResponse({'message': 'CSV imported successfully'})


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def export_tasks(request, format):
#     tasks = Task.objects.filter(user=request.user)

#     if format == 'csv':
#         response = HttpResponse(content_type='text/csv')
#         response['Content-Disposition'] = 'attachment; filename="tasks.csv"'
#         writer = csv.writer(response)
#         writer.writerow(['id', 'title', 'description', 'due_date', 'completed'])
#         for task in tasks:
#             writer.writerow([task.id, task.title, task.description, task.due_date, task.completed])
#         return response

#     elif format == 'json':
#         from .serializers import TaskSerializer
#         serializer = TaskSerializer(tasks, many=True)
#         response = HttpResponse(
#             json.dumps(serializer.data, indent=4),
#             content_type='application/json'
#         )
#         response['Content-Disposition'] = 'attachment; filename="tasks.json"'
#         return response

#     elif format == 'text':
#         content = ""
#         for task in tasks:
#             content += f"{task.title} - {task.description} - Completed: {task.completed}\n"
#         response = HttpResponse(content, content_type='text/plain')
#         response['Content-Disposition'] = 'attachment; filename="tasks.txt"'
#         return response

#     elif format == 'sql':
#         content = ""
#         for task in tasks:
#             content += (
#                 f"INSERT INTO tasks (title, description, due_date, completed, user_id) VALUES "
#                 f"('{task.title}', '{task.description}', '{task.due_date}', {task.completed}, {task.user.id});\n"
#             )
#         response = HttpResponse(content, content_type='application/sql')
#         response['Content-Disposition'] = 'attachment; filename="tasks.sql"'
#         return response

#     return HttpResponse('Unsupported export format', status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_csv(request):
    tasks = Task.objects.filter(user=request.user)
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="tasks.csv"'
    writer = csv.writer(response)
    writer.writerow(['id', 'title', 'description', 'due_date', 'completed'])
    for task in tasks:
        writer.writerow([task.id, task.title, task.description, task.due_date, task.completed])
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_json(request):
    tasks = Task.objects.filter(user=request.user)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_text(request):
    tasks = Task.objects.filter(user=request.user)
    response = HttpResponse(content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename="tasks.txt"'
    for task in tasks:
        response.write(f"{task.title} - {task.description} - Completed: {task.completed}\n")
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_sql(request):
    tasks = Task.objects.filter(user=request.user)
    response = HttpResponse(content_type='text/sql')
    response['Content-Disposition'] = 'attachment; filename="tasks.sql"'
    for task in tasks:
        sql = f"INSERT INTO tasks (title, description, due_date, completed) VALUES ('{task.title}', '{task.description}', '{task.due_date}', {task.completed});\n"
        response.write(sql)
    return response



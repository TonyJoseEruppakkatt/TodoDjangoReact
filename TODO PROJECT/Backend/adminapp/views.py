import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from django.utils.dateparse import parse_date
from django.contrib.auth.models import User
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from apiapp.models import Task, UserActivity
from apiapp.models import Task, UserActivity, UserProfile

import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def admin_login(request):
    if request.method == "POST":
        # Try JSON body first
        try:
            data = json.loads(request.body.decode("utf-8"))
            username = data.get("username")
            password = data.get("password")
        except:
            # Fallback to form-data / x-www-form-urlencoded
            username = request.POST.get("username")
            password = request.POST.get("password")

        if not username or not password:
            return JsonResponse({"error": "Username and password are required"}, status=400)

        user = authenticate(request, username=username, password=password)

        if user is not None and user.is_staff:  # only admins/staff
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({
                "message": "Admin login successful!",
                "token": token.key,
                "username": user.username
            })
        else:
            return JsonResponse({"error": "Invalid credentials or not an admin"}, status=400)

    return JsonResponse({"error": "POST method required"}, status=405)

@csrf_exempt
def admin_logout(request):
    logout(request)
    return JsonResponse({"success": True, "message": "Logged out successfully"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    user = request.user
    if not user.is_staff and not user.is_superuser:
        return Response({'error': 'Access denied. Admins only.'}, status=403)

    total_users = User.objects.count()
    total_tasks = Task.objects.count()
    completed_tasks = Task.objects.filter(completed=True).count()
    pending_tasks = Task.objects.filter(completed=False).count()
    premium_users = UserProfile.objects.filter(is_premium=True).count()

    return Response({
        'admin': user.username,
        'total_users': total_users,
        'premium_users': premium_users,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'pending_tasks': pending_tasks,
    })


@api_view(['POST'])
@permission_classes([IsAdminUser])
def toggle_premium(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        profile = user.userprofile
        profile.is_premium = not profile.is_premium
        profile.save()
        return Response({
            "message": f"{user.username} premium status changed to {profile.is_premium}"
        })
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_tasks(request):
    if not request.user.is_staff:
        return Response({'error': 'Admins only'}, status=403)

    tasks = Task.objects.all().order_by('-due_date')
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

# ✅ Admin Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin(request):
    user = request.user
    return Response({
        'username': user.username,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'email': user.email,
        'is_premium': user.userprofile.is_premium,  # ✅ show premium status
    })
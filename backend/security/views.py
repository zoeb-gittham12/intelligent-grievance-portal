from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile

@api_view(['POST'])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        profile = UserProfile.objects.filter(user=user).first()
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": profile.role
        })
    return Response({"error": "Invalid credentials"}, status = 401)
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def secure_data(request):
    return Response({
        "user": request.user.username,
        "message": "You are logged in"
    })
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_only(request):
    profile = UserProfile.objects.get(user=request.user)
    if profile.role != "admin":
        return Response({"error": "Access denied"})
    return Response({"message": "Welcome Admin"})

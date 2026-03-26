from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Complaint
from security.models import UserProfile


# ---------------- AI CLASSIFICATION ----------------
def classify(text):
    text = text.lower()

    if "wifi" in text or "internet" in text:
        return "IT", "Medium"
    elif "fee" in text or "payment" in text:
        return "Accounts", "High"
    elif "hostel" in text:
        return "Hostel", "High"

    return "General", "Low"


# ---------------- SUBMIT COMPLAINT ----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_complaint(request):
    text = request.data.get("text")

    if not text:
        return Response({"error": "Complaint text is required"}, status=400)

    department, priority = classify(text)

    complaint = Complaint.objects.create(
        user=request.user,
        text=text,
        department=department,
        priority=priority
    )

    return Response({
        "message": "Complaint submitted successfully",
        "complaint_id": complaint.id,
        "department": department,
        "priority": priority
    })


# ---------------- ADMIN: VIEW ALL ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_complaints(request):
    profile = UserProfile.objects.get(user=request.user)

    if profile.role != "admin":
        return Response({"error": "Access denied"}, status=403)

    data = Complaint.objects.all().values()
    return Response(data)


# ---------------- STUDENT: VIEW OWN ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_complaints(request):
    data = Complaint.objects.filter(user=request.user).values()
    return Response(data)


# ---------------- ADMIN: UPDATE STATUS ----------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_status(request, complaint_id):
    profile = UserProfile.objects.get(user=request.user)

    if profile.role != "admin":
        return Response({"error": "Access denied"}, status=403)

    try:
        complaint = Complaint.objects.get(id=complaint_id)
    except Complaint.DoesNotExist:
        return Response({"error": "Complaint not found"}, status=404)

    new_status = request.data.get("status")

    if new_status not in ["Pending", "In Progress", "Resolved"]:
        return Response({"error": "Invalid status"}, status=400)

    complaint.status = new_status
    complaint.save()

    return Response({
        "message": "Status updated successfully",
        "status": complaint.status
    })
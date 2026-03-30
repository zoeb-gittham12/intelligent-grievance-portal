from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Complaint
from .serializers import ComplaintSerializer
from ai_engine.services import analyze_complaint_text


@api_view(['POST'])
def create_complaint(request):

    serializer = ComplaintSerializer(data=request.data)

    if serializer.is_valid():

        description = serializer.validated_data['description']

        # 🔥 Call AI automatically
        try:
            ai_result = analyze_complaint_text(description)
        except Exception:
                    ai_result = {
                        "department": "general",
                        "priority": "Medium",
                        "confidence": 0.0,
                        "source": "fallback"
                    }

        complaint = serializer.save(
            department=ai_result.get('department'),
            priority=ai_result.get('priority'),
            ai_confidence=ai_result.get('confidence'),
            ai_source=ai_result.get('source')
        )

        return Response(
            ComplaintSerializer(complaint).data,
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_complaints(request):

    complaints = Complaint.objects.all().order_by('-created_at')

    serializer = ComplaintSerializer(complaints, many=True)

    return Response(serializer.data)

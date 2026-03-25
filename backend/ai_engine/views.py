from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services import analyze_complaint_text


@api_view(['POST'])
def analyze_complaint(request):
    text = request.data.get("text", "")

    if not text:
        return Response({"error": "No text provided"}, status=400)

    result = analyze_complaint_text(text)
    return Response(result)
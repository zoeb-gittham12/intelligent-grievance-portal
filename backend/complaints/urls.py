from django.urls import path
from .views import submit_complaint, all_complaints, my_complaints, update_status

urlpatterns = [
    path('submit/', submit_complaint),
    path('all/', all_complaints),
    path('my/', my_complaints),
    path('update/<int:complaint_id>/', update_status),
]
from django.urls import path
from .views import create_complaint, list_complaints

urlpatterns = [
    path('', list_complaints),        # GET all complaints
    path('create/', create_complaint) # POST new complaint
]
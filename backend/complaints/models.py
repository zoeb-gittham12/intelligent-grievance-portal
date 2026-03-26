from django.db import models
from django.contrib.auth.models import User

class Complaint(models.Model):
    PRIORITY_CHOICES = (
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    )

    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    department = models.CharField(max_length=50)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:50]
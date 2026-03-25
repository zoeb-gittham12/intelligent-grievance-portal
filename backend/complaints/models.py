from django.db import models


class Complaint(models.Model):

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved'),
    ]

    DEPARTMENT_CHOICES = [
        ('academics', 'Academics'),
        ('hostel', 'Hostel'),
        ('administration', 'Administration'),
        ('general', 'General'),
    ]

    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()

    department = models.CharField(
        max_length=50,
        choices=DEPARTMENT_CHOICES,
        default='general'
    )

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='Medium'
    )

    ai_confidence = models.FloatField(default=0.0)
    ai_source = models.CharField(max_length=20, default='local')

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

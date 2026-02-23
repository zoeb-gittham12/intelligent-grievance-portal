from django.urls import path
from .views import login_view, secure_data, admin_only 
urlpatterns = [
    path('login/', login_view),
    path('secure/', secure_data),
    path('admin-only/', admin_only),
]
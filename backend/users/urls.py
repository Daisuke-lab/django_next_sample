from django.urls import path, re_path
from . import views

urlpatterns = [
    path('<str:pk>/', views.UpdateUser.as_view()),
]
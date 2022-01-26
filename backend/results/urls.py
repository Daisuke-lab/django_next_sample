from django.urls import path
from . import views

urlpatterns = [
    path('', views.ListResult.as_view()),
    # path('<int:pk>/', views.RetrieveUpdateDestroyEntrant.as_view())
]
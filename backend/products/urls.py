from django.urls import path
from . import views

urlpatterns = [
    path('', views.ListCreateProduct.as_view()),
    path('<int:pk>/', views.RetrieveUpdateDestroyProduct.as_view()),
    path('genre/', views.ListCreateGenre.as_view()),
    path('genre/<int:pk>/', views.RetrieveUpdateDestroyGenre.as_view())
]
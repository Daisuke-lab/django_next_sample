from django.urls import path
from . import views

urlpatterns = [
    path('', views.ListCreateDomain.as_view()),
    path('<int:pk>/', views.RetrieveUpdateDestroyDomain.as_view()),
    path('trademark/', views.ListCreateTrademark.as_view()),
    path('trademark/<int:pk>/', views.RetrieveUpdateDestroyTrademark.as_view())
]
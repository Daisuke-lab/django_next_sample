from django.urls import path
from . import views

urlpatterns = [
    path('', views.ListCreateProductCondition.as_view()),
    path('list/', views.ListProductCondition.as_view()),
    path('<int:pk>/', views.RetrieveUpdateDestroyProductCondition.as_view())
]
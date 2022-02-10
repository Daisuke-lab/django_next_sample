from django.urls import path, re_path
from . import views

urlpatterns = [
    re_path(r'^$', views.ListCreateDomain.as_view()),
    path('<int:pk>/', views.RetrieveUpdateDestroyDomain.as_view()),
    re_path(r'^trademark$', views.ListCreateTrademark.as_view()),
    path('trademark/<int:pk>/', views.RetrieveUpdateDestroyTrademark.as_view())
]
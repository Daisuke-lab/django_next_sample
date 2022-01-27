from django.urls import path, re_path
from . import views

urlpatterns = [
    re_path(r'^product$', views.ListProductResult.as_view()),
    re_path(r'^list$', views.ListCheckResult.as_view()),
    path('<int:pk>/', views.RetrieveUpdateDestroyCheckResult.as_view())
]
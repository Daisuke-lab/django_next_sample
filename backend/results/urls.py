from django.urls import path, re_path
from . import views

urlpatterns = [
    path('product/', views.ListResult.as_view()),
    re_path(r'^list$', views.ListCheckResult.as_view())
]
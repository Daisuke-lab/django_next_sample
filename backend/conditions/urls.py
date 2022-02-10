from django.urls import path, re_path
from . import views

urlpatterns = [
    re_path(r'^$', views.ListCreateProductCondition.as_view()),
    re_path(r'^list?', views.ListProductCondition.as_view()),
    path('<int:pk>/', views.RetrieveUpdateDestroyProductCondition.as_view())
]
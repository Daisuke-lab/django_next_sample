from django.urls import path, re_path
from . import views

urlpatterns = [
    re_path(r'^$', views.ListCreateProduct.as_view()),
    path('<int:pk>/', views.RetrieveUpdateDestroyProduct.as_view()),
    path('genre/', views.ListCreateGenre.as_view()),
    re_path(r'^small_genre$', views.ListCreateSmallGenre.as_view()),
    path('genre/<int:pk>/', views.RetrieveUpdateDestroyGenre.as_view())
]
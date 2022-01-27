
from django.contrib import admin
from django.urls import path, include
from .views import home, celery_test
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/product/', include('products.urls'),name="product"),
    path('api/v1/domain/', include('domains.urls'),name="domain"),
    path('api/v1/result/', include('results.urls'),name="result"),
    path('api/v1/condition/', include('conditions.urls'),name="condition"),
    path('test/', celery_test),
    path('', home)
]

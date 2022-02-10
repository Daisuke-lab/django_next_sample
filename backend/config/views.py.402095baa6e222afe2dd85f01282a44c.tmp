from django.http import HttpResponse, JsonResponse
from .tasks import test, create_result
from rest_framework import generics
from products.models import Product
from rest_framework.permissions import AllowAny

def celery_test(request):
    test.delay()
    return HttpResponse("this is test")

def home(request):
    #health check用
    return HttpResponse("this is medicine robo backend home2")


def check_start(request):
    data = request.POST["product_ids"]
    print(data)
    return HttpResponse("this is medicine robo backend home")


class ResultCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        product_ids = request.data.get("product_ids", [])
        create_result.delay(product_ids)
        return JsonResponse({"status": "SUCCESS"})
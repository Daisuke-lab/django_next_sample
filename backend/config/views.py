from django.http import HttpResponse
from .tasks import test

def celery_test(request):
    test.delay()
    return HttpResponse("this is test")

def home(request):
    #health check用
    return HttpResponse("this is medicine robo backend home") 
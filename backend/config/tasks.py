from __future__ import absolute_import, unicode_literals
from celery import shared_task
import time
import requests
from backend_module.update_domain import UpdateDomain
from backend_module.update_url import UpdateTargetUrl
from backend_module.ng_check import NgCheck
import sys
import os

@shared_task
def test():
    headers = {'X-ChatWorkToken': '026ca999c15fbc5894d4505d157417f4'}
    requests.post(
    'https://api.chatwork.com/v2/rooms/212622201/messages',
    data={"body": 'this is test'},
    headers=headers)

@shared_task
def create_result(product_ids):
    try:
        for product_id in product_ids:
            domains = UpdateDomain().job(product_id=product_id)
            UpdateTargetUrl().job(domains=domains)
            NgCheck().job(domains=domains)
    except Exception as e: 
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        errors = [exc_type, fname, exc_tb.tb_lineno, exc_obj]
        headers = {'X-ChatWorkToken': '026ca999c15fbc5894d4505d157417f4'}
        requests.post(
        'https://api.chatwork.com/v2/rooms/212622201/messages',
        data={"body": str(errors)},
        headers=headers)


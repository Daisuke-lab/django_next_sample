from __future__ import absolute_import, unicode_literals
from celery import shared_task
import time
import requests
from backend_module.update_domain import UpdateDomain
from backend_module.update_url import UpdateTargetUrl
from backend_module.ng_check import NgCheck
import sys
import os

headers = {'X-ChatWorkToken': '026ca999c15fbc5894d4505d157417f4'}


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
            print("start to update domain")
            UpdateDomain().job(product_id=product_id)
            print("success to update domain")
            print("start to update url")
            UpdateTargetUrl().job(product_id=product_id)
            print("success to update url")
            print("start to check ng word")
            NgCheck().job(product_id=product_id)
            print("success to check ng word")
        success_message = f"medipatのチェックが完了しました！(dance)"
        requests.post(
        'https://api.chatwork.com/v2/rooms/251333253/messages',
        data={"body": success_message},
        headers=headers)


    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        errors = [exc_type, fname, exc_tb.tb_lineno, exc_obj]
        error_message = f"medipatでエラーが発生しました。 \n\n{errors}"
        requests.post(
        'https://api.chatwork.com/v2/rooms/251333253/messages',
        data={"body": error_message},
        headers=headers)


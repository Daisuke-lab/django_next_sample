from __future__ import absolute_import, unicode_literals
from celery import shared_task
import time
import requests
@shared_task
def test():
    headers = {'X-ChatWorkToken': '026ca999c15fbc5894d4505d157417f4'}
    requests.post(
    'https://api.chatwork.com/v2/rooms/212622201/messages',
    data={"body": 'this is test'},
    headers=headers)



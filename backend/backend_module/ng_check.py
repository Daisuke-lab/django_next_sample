
from itertools import product
import time
import re
import requests
from bs4 import BeautifulSoup
from .common import Common
from domains.models import Domain, Trademark, Url
from conditions.models import NG_Keyword_Condition
from products.models import Product
from results.models import Check_Result

class NgCheck(Common):
    def update_check_result_table(self, url, priority):
        try:
            result = Check_Result.objects.get(url=url)
            result.priority = priority
            result.confirmed = False
            result.save()
        except:
            Check_Result.objects.create(url=url, priority=priority, confirmed=False)

    def ng_check(self, middle_kws, target_urls):
        for target_url in target_urls:
            # self.driver.get(target_url.url)
            # time.sleep(1)
            # html_source = self.driver.page_source
            # text_source = BeautifulSoup(html_source, "html.parser").text
            try:
                res = requests.get(target_url.url)
                text_source = res.text
            except:
                print(f"サイトのテキストを取得できませんでした：{target_url.url}")
                continue
            if text_source == "":
                print(f"サイトのテキストを取得できませんでした：{target_url.url}")
                continue
            for middle_kw in middle_kws:
                priority = 3
                ng_kw = str(middle_kw.ng_keyword)
                composite_kw = str(middle_kw.composite_keyword)
                front_word_count = middle_kw.front_check_word_count
                back_word_count = middle_kw.back_check_word_count
                ng_kw_check_list = list(re.finditer(ng_kw, text_source))
                if len(ng_kw_check_list) > 0 and composite_kw is not None:
                    priority = 2
                    for ng_kw in ng_kw_check_list:
                        ng_kw_start_index = ng_kw.start()
                        ng_kw_start_index = ng_kw.start()
                        ng_kw_end_index = ng_kw.end()
                        front_start_index = max(0, ng_kw_start_index - front_word_count - 1)
                        front_end_index = max(0, ng_kw_start_index - 1)
                        back_start_index = min(len(text_source), ng_kw_end_index + 1)
                        back_end_index = min(len(text_source), ng_kw_end_index + back_word_count + 1)
                        front_result = text_source.find(composite_kw, front_start_index, front_end_index)
                        back_result = text_source.find(composite_kw, back_start_index, back_end_index)
                        if  front_result != -1 and back_result != -1:
                            priority = 1
                            break
                self.update_check_result_table(url=target_url, priority=priority)

    def update_checkresult_status_to_judgement(self, domain):
        target_urls = Url.objects.filter(domain=domain)
        for target_url in target_urls:
            self.update_check_result_table(url=target_url, priority=4)

    def job(self, product_id):
        product_instance = Product.objects.get(id=product_id)
        trademark_kws = Trademark.objects.filter(product=product_instance)
        domains = []
        for trademark_kw in trademark_kws:
            domains += Domain.objects.filter(trademark=trademark_kw, _type=2)
        # domainsは、{domain:, trademark_kw:}の辞書型リスト
        for domain in domains:
            self.update_checkresult_status_to_judgement(domain=domain)
        print("success to update all urls flag to judgement !")
        for domain in domains:
            print(f"checking this domain: {domain}")
            client_target_urls = Url.objects.filter(domain=domain)
            middle_kws = NG_Keyword_Condition.objects.filter(product_condition=Product.objects.get(id=product_id).product_condition).exclude(status=0)
            self.ng_check(middle_kws=middle_kws, target_urls=client_target_urls)
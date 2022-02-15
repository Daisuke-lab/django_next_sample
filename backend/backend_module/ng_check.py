
import time
import re
from backend_module.common import Common
from domains.models import Domain, Trademark, Url
from conditions.models import NG_Keyword_Condition
from products.models import Product
from results.models import Check_Result

class NgCheck(Common):
    def ng_check(self, middle_kws, target_urls):
        for target_url in target_urls:
            self.driver.get(target_url.url)
            time.sleep(1)
            source = self.driver.page_source
            for middle_kw in middle_kws:
                priority = 1
                ng_kw = middle_kw.ng_keyword
                composite_kw = middle_kw.composite_keyword
                front_word_count = middle_kw.front_check_word_count
                back_word_count = middle_kw.back_check_word_count
                ng_kw_check_list = list(re.finditer(ng_kw, source.text))
                if len(ng_kw_check_list) > 0 and composite_kw is not None:
                    print("NGキーワードを発見しました")
                    priority = 2
                    for ng_kw in ng_kw_check_list:
                        ng_kw_start_index = ng_kw.start()
                        ng_kw_end_index = ng_kw.end()
                        front_start_index = max(0, ng_kw_start_index - front_word_count - 1)
                        front_end_index = max(0, ng_kw_start_index - 1)
                        back_start_index = min(len(source.text), ng_kw_end_index + 1)
                        back_end_index = min(len(source.text), ng_kw_end_index + back_word_count + 1)
                        front_result = source.text.find(composite_kw, front_start_index, front_end_index)
                        back_result = source.text.find(composite_kw, back_start_index, back_end_index)
                        if  front_result != -1 and back_result != -1:
                            priority = 3
                            break
                Check_Result.objects.create(url=target_url.url, priority=priority, confirmed=False)

    def job(self, domains, product_id):
        # domainsは、{domain:, trademark_kw:}の辞書型リスト
        for target_domain in domains:
            client_target_urls = Url.objects.filter(domain=target_domain["domain"])
            middle_kws = NG_Keyword_Condition.objects.filter(product_condition=Product.objects.get(id=product_id).product_condition).exclude(status=0)
            self.ng_check(middle_kws=middle_kws, target_urls=client_target_urls)
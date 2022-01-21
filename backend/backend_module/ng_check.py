
from backend_module.common import Common
import time
import re
from urls.models import Url
from domains.models import Domain, Trademark
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
                ng_kw = middle_kw.ng_keyword
                composite_kw = middle_kw.composite_keyword
                front_word_count = middle_kw.front_check_word_count
                back_word_count = middle_kw.back_check_word_count
                ng_kw_check_list = list(re.finditer(ng_kw, source.text))
                if len(ng_kw_check_list) > 0:
                    print("NGキーワードを発見しました")
                    priority = 2
                    for ng_kw in ng_kw_check_list:
                        ng_kw_start_index = ng_kw.start()
                        ng_kw_end_index = ng_kw.end()
                        front_result = source.text.find(composite_kw, ng_kw_start_index - front_word_count - 1, ng_kw_start_index - 1)
                        back_result = source.text.find(composite_kw, ng_kw_end_index + 1, ng_kw_end_index + back_word_count + 1)
                        if not front_result and not back_result:
                            priority = 3
                            break
                    Check_Result.objects.create(url=target_url.url, priority=priority, confirmed=False)

    def job(self, **kwargs):
        # kwargsにはtrademark_kw_idとproduct_idを引数として与える
        trademark_kw_id = kwargs["trademark_kw_id"]
        product_id = kwargs["product_id"]

        trademark = Trademark.objects.get(id=trademark_kw_id)
        client_target_domains = Domain.objects.fileter(trademark=trademark)

        for domain in client_target_domains:
            client_target_urls = Url.objects.fileter(domain=domain)
            middle_kws = NG_Keyword_Condition.objects.filter(product_condition=Product.objects.get(id=product_id).product_condition)
            self.ng_check(middle_kws=middle_kws, target_urls=client_target_urls)
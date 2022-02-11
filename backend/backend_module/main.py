from update_domain import UpdateDomain
from update_url import UpdateTargetUrl
from ng_check import NgCheck

def main(product_id_list):
    for product_id in product_id_list:
        domains = UpdateDomain().job(product_id=product_id)
        UpdateTargetUrl().job(domains=domains, product_id=product_id)
        NgCheck().job(domains=domains)
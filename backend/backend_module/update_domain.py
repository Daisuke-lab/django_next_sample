# 調査対象ドメインのリストをget
import imp
import sys
from turtle import update

sys.path.append("../")
from .common import Common
import re
import datetime
import time
from . import config
from django.utils import timezone
from googleapiclient.discovery import build
from domains.models import Domain, Url, Trademark
from products.models import Product
from users.models import User
import urllib.parse

class UpdateDomain(Common):
    # def get_dotai_domains(self):
    #     all_domains = []
    #     query1 = (
    #         f"SELECT alliance.ID FROM program_url INNER JOIN alliance "
    #         "ON program_url.id = alliance.PROGRAM_URL_ID "
    #         f"WHERE program_url.MERCHANT_ID = {self.client_presco_id}"
    #     )

    #     alliance_ids = self.commit_query(conn=self.conn_presco, query=query1, select=True)
    #     partner_site_page_ids = []
    #     for value in alliance_ids:
    #         alliance_id = value["ID"]
    #         query2 = (
    #             "SELECT PARTNER_SITE_PAGE_ID, end_date FROM alliance INNER JOIN alliance_history ON "
    #             f"alliance.id = alliance_history.alliance_id WHERE alliance_id = {alliance_id};"
    #         )
    #         end_check_result = self.commit_query(conn=self.conn_presco, query=query2, select=True)
    #         end_date = end_check_result[0]["end_date"]
    #         if end_date is None:
    #             partner_site_page_ids.append(end_check_result[0]["PARTNER_SITE_PAGE_ID"])
    #         elif end_date > datetime.date.today():
    #             partner_site_page_ids.append(end_check_result[0]["PARTNER_SITE_PAGE_ID"])

    #     partner_site_page_ids = set(partner_site_page_ids)
    #     for partner_site_page_id in partner_site_page_ids:
    #         query3 = f"SELECT PARTNER_SITE_URL_OTHER FROM partner_site_page WHERE id = {partner_site_page_id}"
    #         partner_site_result = self.commit_query(
    #             conn=self.conn_presco, query=query3, select=True
    #         )
    #         all_domains.append(partner_site_result[0]["PARTNER_SITE_URL_OTHER"])
    #     all_domains = list(set(all_domains))
    #     return all_domains

    # def get_referrer_domain(self):
    #     domains = []
    #     update_domains = []
    #     query1 = (
    #         f"SELECT DISTINCT referrer,pg_id FROM click_log "
    #         f"WHERE merchant_id = {self.client_presco_id} && referrer != ''"
    #     )
    #     click_logs = self.commit_query(conn=self.conn_presco, query=query1, select=True)
    #     for click_log in click_logs:
    #         referrer = click_log["referrer"]
    #         domain = re.match(r"(https?://[^/]+/)", referrer)
    #         if domain is not None:
    #             if domain.group(0) not in domains and ".safeframe" not in domain.group(0):
    #                 domains.append(domain.group(0))
    #     for domain in domains:
    #         query2 = f"SELECT id FROM partner_site_page WHERE partner_site_url_other = '{domain}'"
    #         partner_site_pages = self.commit_query(
    #             conn=self.conn_presco, query=query2, select=True
    #         )
    #         if partner_site_pages != []:
    #             partner_site_page = partner_site_pages[0]
    #             query3 = (
    #                 "SELECT end_date FROM summary_log INNER JOIN alliance_history ON "
    #                 "summary_log.alliance_id = alliance_history.alliance_id "
    #                 f"WHERE summary_log.partner_site_page_id = {partner_site_page['id']}"
    #             )
    #             end_dates = self.commit_query(conn=self.conn_presco, query=query3, select=True)
    #             end_dates = [i["end_date"] for i in end_dates]
    #             if end_dates.count(None) == len(end_dates):
    #                 update_domains.append(str(domain))
    #         else:
    #             update_domains.append(str(domain))
    #     return update_domains

    def get_presco_copy_domains(self, product_instance):
        user_instance = product_instance.user
        try:
            user_mc_id = user_instance.mc_id
            query = f"SELECT domain FROM presco_db_copy WHERE mc_id = '{user_mc_id}'"
            presco_copy_domains = self.commit_query(conn=self.conn_presco_copy, query=query, select=True)
            domains = [data["domain"] for data in presco_copy_domains]
            return domains
        except:
            return []

    def get_domain_from_url(self, url):
        return urllib.parse.urlparse(url).scheme + "://" + urllib.parse.urlparse(url).netloc

    def get_specific_search_domains(self, trademark_kw):
        result_domain_lists = []
        keyword = f"intext:'{trademark_kw.name}'"
        GOOGLE_API_KEY = config.GOOGLE_API_KEY
        CUSTOM_SEARCH_ENGINE_ID = config.CUSTOM_SEARCH_ENGINE_KEY
        service = build("customsearch", "v1", developerKey=GOOGLE_API_KEY)
        res = []
        start_index = 1
        page_limit = 10
        for n_page in range(0, page_limit):
            total_result_check = 0
            while True:
                try:
                    time.sleep(1)
                    res.append(
                        service.cse()
                            .list(
                            q=keyword,
                            cx=CUSTOM_SEARCH_ENGINE_ID,
                            lr="lang_ja",
                            num=10,
                            start=start_index,
                        )
                            .execute()
                    )
                    if n_page == 0:
                        total_result = int(res[0].get("searchInformation").get("totalResults"))
                        print(f"検索結果：{total_result}件 intext:'{trademark_kw.name}'")
                        print(f"調査キーワード：{keyword}")
                        if total_result == 0:
                            total_result_check = 1
                            break
                    break
                except Exception as e:
                    print(e)
                    break
            if total_result_check:
                print("検索結果が0件でした")
                break
            try:
                start_index = res[n_page].get("queries").get("nextPage")[0].get("startIndex")
            except:
                print("ページが１ページしかありません")
                break
        for uni_res in res:
            if "items" in uni_res and len(uni_res["items"]) > 0:
                for item in uni_res["items"]:
                    domain = self.get_domain_from_url(url=item["link"])
                    result_domain_lists.append(domain)
        return result_domain_lists

    def update_domain_database(self, domains, trademark_kw):
        for domain in domains:
            if domain == "":
                continue
            if Domain.objects.filter(domain=domain, trademark=trademark_kw).exists():
                client_domain = Domain.objects.get(domain=domain, trademark=trademark_kw)
                client_domain.status = 1
                client_domain.updated_at = timezone.now()
                client_domain.save()
            else:
                Domain.objects.create(trademark=trademark_kw, domain=domain, status=1, _type=2)

    def job(self, product_id):
        product_instance = Product.objects.get(id=product_id)
        trademark_kws = Trademark.objects.filter(product=product_instance)
        # プレスコのデータを取得できなくなってしまったためコメントアウト
        # dotai_domains = self.get_dotai_domains()
        # referrer_domains = self.get_referrer_domain()
        print(f"success to get trademark keywords: {trademark_kws}")
        for trademark_instance in trademark_kws:
            specific_search_domains = self.get_specific_search_domains(trademark_kw=trademark_instance)
            print(f"success to get specific domains: {specific_search_domains}")
            presco_copy_domains = self.get_presco_copy_domains(product_instance=product_instance)
            print(f"success to get presco domains: {presco_copy_domains}")
            all_domains = specific_search_domains + presco_copy_domains
            self.update_domain_database(domains=all_domains, trademark_kw=trademark_instance)
            print("success to update database")
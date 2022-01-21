# 調査対象ドメインのリストをget
import imp
import sys
from turtle import update

sys.path.append("../")
from backend_module.common import Common
import re
import datetime
import time
import config
from django.utils import timezone
from googleapiclient.discovery import build
from domains.models import Domain, Url, Trademark

class UpdateDomain(Common):
    def get_dotai_domains(self):
        all_domains = []
        query1 = (
            f"SELECT alliance.ID FROM program_url INNER JOIN alliance "
            "ON program_url.id = alliance.PROGRAM_URL_ID "
            f"WHERE program_url.MERCHANT_ID = {self.client_presco_id}"
        )

        alliance_ids = self.commit_query(conn=self.conn_presco, query=query1, select=True)
        partner_site_page_ids = []
        for value in alliance_ids:
            alliance_id = value["ID"]
            query2 = (
                "SELECT PARTNER_SITE_PAGE_ID, end_date FROM alliance INNER JOIN alliance_history ON "
                f"alliance.id = alliance_history.alliance_id WHERE alliance_id = {alliance_id};"
            )
            end_check_result = self.commit_query(conn=self.conn_presco, query=query2, select=True)
            end_date = end_check_result[0]["end_date"]
            if end_date is None:
                partner_site_page_ids.append(end_check_result[0]["PARTNER_SITE_PAGE_ID"])
            elif end_date > datetime.date.today():
                partner_site_page_ids.append(end_check_result[0]["PARTNER_SITE_PAGE_ID"])

        partner_site_page_ids = set(partner_site_page_ids)
        for partner_site_page_id in partner_site_page_ids:
            query3 = f"SELECT PARTNER_SITE_URL_OTHER FROM partner_site_page WHERE id = {partner_site_page_id}"
            partner_site_result = self.commit_query(
                conn=self.conn_presco, query=query3, select=True
            )
            all_domains.append(partner_site_result[0]["PARTNER_SITE_URL_OTHER"])
        all_domains = list(set(all_domains))
        return all_domains

    def get_referrer_domain(self):
        domains = []
        update_domains = []
        query1 = (
            f"SELECT DISTINCT referrer,pg_id FROM click_log "
            f"WHERE merchant_id = {self.client_presco_id} && referrer != ''"
        )
        click_logs = self.commit_query(conn=self.conn_presco, query=query1, select=True)
        for click_log in click_logs:
            referrer = click_log["referrer"]
            domain = re.match(r"(https?://[^/]+/)", referrer)
            if domain is not None:
                if domain.group(0) not in domains and ".safeframe" not in domain.group(0):
                    domains.append(domain.group(0))
        for domain in domains:
            query2 = f"SELECT id FROM partner_site_page WHERE partner_site_url_other = '{domain}'"
            partner_site_pages = self.commit_query(
                conn=self.conn_presco, query=query2, select=True
            )
            if partner_site_pages != []:
                partner_site_page = partner_site_pages[0]
                query3 = (
                    "SELECT end_date FROM summary_log INNER JOIN alliance_history ON "
                    "summary_log.alliance_id = alliance_history.alliance_id "
                    f"WHERE summary_log.partner_site_page_id = {partner_site_page['id']}"
                )
                end_dates = self.commit_query(conn=self.conn_presco, query=query3, select=True)
                end_dates = [i["end_date"] for i in end_dates]
                if end_dates.count(None) == len(end_dates):
                    update_domains.append(str(domain))
            else:
                update_domains.append(str(domain))
        return update_domains

    def get_specific_search_domains(self):
        result_domain_lists = []
        keyword = f"intext:'{self.trademark_kw.name}'"
        GOOGLE_API_KEY = config.GOOGLE_API_KEY
        CUSTOM_SEARCH_ENGINE_ID = config.CUSTOM_SEARCH_ENGINE_KEY
        service = build("customsearch", "v1", developerKey=GOOGLE_API_KEY)
        res = []
        start_index = 1
        page_limit = 5
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
                        print(f"検索結果：{total_result}件 intext:'{self.trademark_kw.name}'")
                        if total_result == 0:
                            total_result_check = 1
                            break
                    break
                except Exception as e:
                    print(e)
                    break
            if total_result_check:
                print("検索結果が０件または")
                break
            try:
                start_index = res[n_page].get("queries").get("nextPage")[0].get("startIndex")
            except:
                print("ページが１ページしかありません")
                break
        for uni_res in res:
            if "items" in uni_res and len(uni_res["items"]) > 0:
                for item in uni_res["items"]:
                    link = item["link"]
                    result_domain_lists.append(link)
        return result_domain_lists

    def update_domain_database(self, all_domains):
        for domain in all_domains:
            if domain == "":
                continue
            client_domain = Domain.objects.get(domain=domain, trademark=self.trademark_kw)
            if client_domain is None:
                Domain.objects.create(trademark=self.trademark_kw, domain=domain, status=1)
            else:
                client_domain.status = 1
                client_domain.updated_at = timezone.now()
                client_domain.save()

    def job(self, **kwargs):
        # kwargsにはtrademark_kw_idとclient_presco_idを引数として与える
        trademark_kw_id = kwargs["trademark_kw_id"]
        self.trademark_kw = Trademark.objects.get(id=trademark_kw_id)
        self.client_presco_id = kwargs["client_presco_id"]

        dotai_domains = self.get_dotai_domains()
        referrer_domains = self.get_referrer_domain()
        all_domains = dotai_domains + referrer_domains
        all_domains = list(set(all_domains))
        self.update_domain_database(all_domains=all_domains)
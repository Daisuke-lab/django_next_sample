# 調査対象URLのリストをget
from itertools import product
import sys
from products.models import Product

sys.path.append("../")
from backend_module.common import Common
import backend_module.config as config
import time
import requests
from bs4 import BeautifulSoup
import re
import urllib.parse
from googleapiclient.discovery import build
from django.utils import timezone

from domains.models import Domain, Trademark, Url

class UpdateTargetUrl(Common):
    def insert_target_urls(self, target_urls, domain):
        for target_url in target_urls:
            if target_url == "":
                continue
            client_target_url = Url.objects.get(domain=domain, url=target_url)
            if client_target_url is None:
                Url.objects.create(domain=domain, url=target_url)
            else:
                client_target_url.updated_at = timezone.now()
                client_target_url.save()

    def get_loc_urls(self, sitemap_url):
        """サイトマップからURLを抽出するメソッド

        :param sitemap_url: URL一覧があるサイトマップのURL
        :return:
        """
        urls = []
        try:
            res = requests.get(sitemap_url)
        except:
            return []
        soup = BeautifulSoup(res.text, "html.parser")
        loclist = soup.select("loc")
        for loc in loclist:
            url = re.sub("<[a-z]>", "", loc.text)
            urls.append(url)
        return urls

    def get_domain_allurl(self, domain):
        """メディアサイトのサイトマップから、すべての記事を抽出するメソッド

        メディアによっては、さらにカテゴリー分けされており、それは取得してきたURLに.xml拡張子が
        含まれているかどうかで判定する

        :param sitemap_url: メディアサイトのサイトマップURL
        :return: 取得したすべての記事のURL
        """
        all_urls = []
        sitemap_url = urllib.parse.urljoin(domain, "sitemap.xml")
        urls = self.get_loc_urls(sitemap_url)
        for url in urls:
            if ".xml" in url:
                sub_urls = self.get_loc_urls(url)
                for sub_url in sub_urls:
                    all_urls.append(sub_url)
            else:
                all_urls.append(url)
        return all_urls

    def filter_all_urls(self, all_url_list, trademark_kw):
        """抽出してきたすべての記事の中から、指定されたクエリーが含まれているものだけ抽出するメソッド


        :param all_url_list: 抽出してきたすべての記事のURL
        :param querys: 指定されているクエリー
        :return:
        """
        filtered_url_list = []
        for i, url in enumerate(all_url_list):
            print(f"{i+1}/{len(all_url_list)}")
            try:
                res = requests.get(url)
            except Exception as e:
                print(e)
                continue
            if trademark_kw in res.text:
                filtered_url_list.append(url)
        return filtered_url_list

    def get_search_result_api(self, domain, trademark_kw):
        """Google公式のAPIを利用して、site: intext:の検索結果からURLを抽出するメソッド

        :param domain: ドメイン
        :param querys: 指定されているクエリー
        :return:
        """
        result_url_lists = []
        keyword = f"site:{domain} intext:'{trademark_kw}'"
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
                        print(f"検索結果：{total_result}件 intext:'{trademark_kw}'")
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
                break
        for uni_res in res:
            if "items" in uni_res and len(uni_res["items"]) > 0:
                for item in uni_res["items"]:
                    link = item["link"]
                    result_url_lists.append(link)
        return result_url_lists

    def job(self, domains):
        # domainsは、{domain:, trademark_kw:}の辞書型リスト
        for target_domain in domains:
            all_url_list = self.get_domain_allurl(domain=target_domain["domain"])
            if len(all_url_list) > 1000 or len(all_url_list) == 0:
                print("fetch more than 1000 urls or 0")
                print("try to get url by using API...")
                all_url_list = self.get_search_result_api(domain=target_domain["domain"], trademark_kw=target_domain["trademark_kw"])
                filtered_url_list = all_url_list
            else:
                filtered_url_list = self.filter_all_urls(all_url_list=all_url_list, trademark_kw=target_domain["trademark_kw"])
            self.insert_target_urls(target_urls=filtered_url_list, domain=target_domain["domain"])

import mysql.connector
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import os
import random
import requests
import backend_module.config as config
import datetime

class Common:
    def __init__(self):
        # self.conn_presco = self.connect_presco_DB()
        self.conn_presco_copy = self.conncet_presco_copy_DB()
        self.BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
        # self.driver = self.start_chromedriver()

    # def connect_presco_DB(self):
    #     """DB接続

    #     prescoaiが格納されているDBに接続し、コントローラーを返す

    #     """
    #     host = "dotai-production.cf6ivuffba0e.ap-northeast-1.rds.amazonaws.com"

    #     conn = mysql.connector.connect(
    #         host=host, port=3306, user="t.uzuhara", password="Tuzu0101", database="prescoai"
    #     )
    #     return conn

    def conncet_presco_copy_DB(self):
        """DB接続

        prescoに保存されているドメインが格納されているDBに接続し、コントローラーを返す

        """
        host = "mediadb.cf6ivuffba0e.ap-northeast-1.rds.amazonaws.com"

        conn = mysql.connector.connect(
            host=host, port=3306, user="t.uzuhara", password="Tuzuhara", database="medicine_app"
        )
        return conn

    def start_chromedriver(self, reset=False):
        """ChromeDriverを起動

        ChromeDriverを起動し、コントローラーを返す。
        project直下ににchromedriver.exeが必要。
        headlessモードを使用するためには、Useragentを変更する必要があるため注意。
        （instagramはheadlessを検知するとエラーを返す仕組みになっている）

        """
        proxies = [
            "102.22.193.41:55443",
            "165.22.81.30:44608",
            "13.235.137.56:8081",
            "95.216.10.237:6000",
            "160.16.72.230:3128",
            "185.42.231.26:55443",
            "128.199.214.87:3128",
            "161.202.226.194:80",
            "190.214.52.226:53281",
            "35.194.223.239:8888",
            "187.130.139.197:8080",
            "169.57.1.84:8123",
            "87.236.212.220:8080",
            "169.57.1.85:80",
            "46.109.210.121:53281",
            "131.221.97.8:55443",
            "186.233.96.246:23500",
            "181.49.100.190:8080",
            "103.15.140.177:44759",
            "181.129.43.3:8080",
        ]

        options = Options()
        options.add_argument(
            "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36")
        options.add_argument("--headless")
        if self.ENVIRONMENT == "production":
            file_path = "/usr/local/bin/chromedriver"
            options.add_argument('--disable-dev-shm-usage')
        else:
            file_path = os.path.join(self.BASE_DIR, "backend_module", "chromedriver.exe")
        if reset:
            random_num = random.randrange(len(proxies) - 1)
            options.add_argument("--proxy-server={}".format(proxies[random_num]))
        driver = webdriver.Chrome(chrome_options=options, executable_path=file_path)
        return driver

    def commit_query(self, conn, query, select):
        cur = conn.cursor(dictionary=True)
        cur.execute(query)
        if select:
            select_list = cur.fetchall()
            return select_list
        conn.commit()
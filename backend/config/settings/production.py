import os

DEBUG = False
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # 変更
        'NAME': os.environ.get('DATABASE_NAME'), # プロジェクトで使用するデータベース名
        'USER': os.environ.get('DATABASE_USER'), # パソコンにインストールしたMySQLのユーザー名
        'PASSWORD': os.environ.get('DATABASE_PASSWORD'), # 同上。そのパスワード
        'HOST': os.environ.get('DATABASE_HOST'),
        'PORT': '3306',
    }
}


CORS_ORIGIN_WHITELIST = [
    'https://yakuji.colue.net',
    "https://medipat.org"
]


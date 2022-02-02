import environ
import os
env = environ.Env()
env.read_env('.env')


DEBUG = True
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # 変更
        'NAME': env('DATABASE_NAME'), # プロジェクトで使用するデータベース名
        'USER': env('DATABASE_USER'), # パソコンにインストールしたMySQLのユーザー名
        'PASSWORD': env('DATABASE_PASSWORD'), # 同上。そのパスワード
        'HOST': env('DATABASE_HOST'),
        'PORT': '3306',
    }
}


CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
]


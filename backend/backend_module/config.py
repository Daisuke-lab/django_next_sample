import environ
import os

environment = os.environ.get('ENVIRONMENT', 'development')

if environment == "development":
    env = environ.Env()
    env.read_env('.env')

    GOOGLE_API_KEY = env("GOOGLE_API_KEY")
    CUSTOM_SEARCH_ENGINE_KEY = env("CUSTOM_SEARCH_ENGINE_KEY")
elif environment == "production":
    GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
    CUSTOM_SEARCH_ENGINE_KEY = os.environ.get("CUSTOM_SEARCH_ENGINE_KEY")
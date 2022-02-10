import environ
import os
from dotenv import load_dotenv

environment = os.environ.get('ENVIRONMENT', 'development')
load_dotenv()
if environment == "development":
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    CUSTOM_SEARCH_ENGINE_KEY = os.getenv("CUSTOM_SEARCH_ENGINE_KEY")
elif environment == "production":
    GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
    CUSTOM_SEARCH_ENGINE_KEY = os.environ.get("CUSTOM_SEARCH_ENGINE_KEY")
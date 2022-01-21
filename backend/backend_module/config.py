import environ

env = environ.Env()
env.read_env('.env')

GOOGLE_API_KEY = env("GOOGLE_API_KEY")
CUSTOM_SEARCH_ENGINE_KEY = env("CUSTOM_SEARCH_ENGINE_KEY")
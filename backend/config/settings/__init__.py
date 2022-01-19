import os
from .common import *
environment = os.environ.get('ENVIRONMENT', 'development')


if environment == 'production':
   from .production import *
else:
   from .development import *
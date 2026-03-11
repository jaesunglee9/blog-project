from .base import *

DEBUG = env.bool('DEBUG', default=True)
ALLOWED_HOSTS = ["*"]

cors_env = env.str("CORS_ALLOWED_ORIGINS", default="http://localhost:3000,http://127.0.0.1:3000")
csrf_env = env.str("CSRF_TRUSTED_ORIGINS", default="http://localhost:3000,http://127.0.0.1:3000")

CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_env.split(",")]
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in csrf_env.split(",")]

# For debug toolbar or other dev-specific apps
INTERNAL_IPS = ['127.0.0.1']

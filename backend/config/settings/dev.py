from .base import *

DEBUG = env.bool('DEBUG', default=True)  # type: ignore[call-overload]
ALLOWED_HOSTS = ["*"]

cors_env: str = env.str("CORS_ALLOWED_ORIGINS", default="http://localhost:3000,http://127.0.0.1:3000")  # type: ignore[call-overload]
csrf_env: str = env.str("CSRF_TRUSTED_ORIGINS", default="http://localhost:3000,http://127.0.0.1:3000")  # type: ignore[call-overload]

CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_env.split(",")]
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in csrf_env.split(",")]

# For debug toolbar or other dev-specific apps
INTERNAL_IPS = ['127.0.0.1']

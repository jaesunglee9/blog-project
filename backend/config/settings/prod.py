from .base import *

DEBUG = env.bool('DEBUG', default=False)
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['localhost', '127.0.0.1', 'yourdomain.com'])

cors_env = env.str("CORS_ALLOWED_ORIGINS", default="https://yourdomain.com")
csrf_env = env.str("CSRF_TRUSTED_ORIGINS", default="https://yourdomain.com")

CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_env.split(",")]
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in csrf_env.split(",")]

# Security Settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = 'DENY'
SECURE_SSL_REDIRECT = env.bool('SECURE_SSL_REDIRECT', default=False)
SECURE_HSTS_SECONDS = 31536000

# Structured Logging
# Need to add python-json-logger to requirements
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'json': {
            '()': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(asctime)s %(levelname)s %(name)s %(module)s %(message)s'
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'json',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

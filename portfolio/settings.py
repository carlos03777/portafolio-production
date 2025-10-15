"""
Django settings for portfolio project.

Generado por 'django-admin startproject' usando Django 5.2.6.
"""

from pathlib import Path
import os
from decouple import config  #  Permite leer variables desde .env o entorno (Railway)

BASE_DIR = Path(__file__).resolve().parent.parent

# ==============================
#  SEGURIDAD Y CONFIGURACIÓN BÁSICA
# ==============================

#  En producción, nunca dejes la clave secreta en texto plano
SECRET_KEY = config('SECRET_KEY')

#  Activar/desactivar modo debug según entorno
DEBUG = config('DEBUG', default=True, cast=bool)

#  Hosts permitidos (Railway, tu dominio, etc.)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

# ==============================
#  APLICACIONES INSTALADAS
# ==============================

INSTALLED_APPS = [
    'jazzmin',  # Interfaz de administración mejorada
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    #  Tus apps locales
    'web',
]

# ==============================
#  MIDDLEWARE
# ==============================

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',

    #  Middleware de WhiteNoise para servir archivos estáticos en producción
    'whitenoise.middleware.WhiteNoiseMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'portfolio.urls'

# ==============================
#  TEMPLATES
# ==============================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],  # 🔹 Carpeta global de templates
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'portfolio.wsgi.application'

# ==============================
#  BASE DE DATOS
# ==============================

#  Por defecto usa SQLite (local)
#  Si hay DATABASE_URL en entorno (Railway/Postgres), la usa automáticamente

import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL', f"sqlite:///{BASE_DIR / 'db.sqlite3'}"),
        conn_max_age=600,
        conn_health_checks=True,
        ssl_require=not os.getenv('DEBUG', '').lower() == 'true'
    )
}


CSRF_TRUSTED_ORIGINS = [
    'https://web-production-3cca.up.railway.app',
    'https://*.railway.app'
]



ALLOWED_HOSTS = [
    'web-production-3cca.up.railway.app',
    '*.railway.app',
    'localhost',
    '127.0.0.1'
]


# ==============================
#  VALIDACIÓN DE CONTRASEÑAS
# ==============================

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ==============================
#  INTERNACIONALIZACIÓN
# ==============================

LANGUAGE_CODE = 'es'  
TIME_ZONE = 'America/Bogota'  
USE_I18N = True
USE_TZ = True

# ==============================
#  ARCHIVOS ESTÁTICOS Y MEDIA
# ==============================

#  Rutas de archivos estáticos globales
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"  #  Carpeta donde collectstatic los reúne

#  WhiteNoise: compresión y cache para archivos estáticos
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

#  Archivos subidos por usuarios
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / "media"



# ==============================
#  SEGURIDAD EXTRA (solo se activan en producción)
# ==============================

if not DEBUG:
    #  Asegura que Django sepa si viene por HTTPS (Railway usa proxy)
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

    #  Cookies seguras (solo HTTPS)
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True

# ==============================
#  LOGGING BÁSICO PARA RAILWAY
# ==============================

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {'console': {'class': 'logging.StreamHandler'}},
    'root': {'handlers': ['console'], 'level': 'WARNING'},
}

# ==============================
#  ID por defecto
# ==============================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



import os
import dj_database_url

print("=== DEBUG DATABASE CONFIG ===")
print("DATABASE_URL =", os.getenv("DATABASE_URL"))
print("DJANGO DATABASES =", dj_database_url.config(default="sqlite:///db.sqlite3"))
print("==============================")

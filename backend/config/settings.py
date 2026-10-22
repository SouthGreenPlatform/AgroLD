import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "insecure-dev-key-change-me")
DEBUG = os.environ.get("DJANGO_DEBUG", "false").lower() == "true"

ALLOWED_HOSTS = [
    h.strip() for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "*").split(",") if h.strip()
]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "rest_framework",
    "drf_spectacular",
    "corsheaders",
    "core",
    "genes",
    "proteins",
    "qtls",
    "pathways",
    "ontologies",
    "graphs",
    "llm",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# No relational database is used: AgroLD is served entirely from the
# Virtuoso RDF triplestore via SPARQL. Django's ORM/admin/auth are unused.
DATABASES = {}

USE_TZ = True
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- AgroLD domain configuration -----------------------------------------
# Mirrors agrold.config.PropertiesBean from the legacy JSP app, but sourced
# from environment variables instead of Tomcat -D system properties.
SPARQL_ENDPOINT = os.environ.get(
    "SPARQL_ENDPOINT", "https://sparql.southgreen.fr/sparql/")
FACETED_SEARCH_URL = os.environ.get(
    "FACETED_SEARCH_URL", "https://sparql.southgreen.fr/fct/")
RF_LINK = os.environ.get("RF_LINK", "http://rf.southgreen.fr/")
AGROLD_INSTANCE = os.environ.get("AGROLD_INSTANCE", "")
API_VERSION = os.environ.get("API_VERSION", "3.0.0")
SPARQL_QUERY_TIMEOUT = int(os.environ.get("SPARQL_QUERY_TIMEOUT", "20"))

EUROPEPMC_SERVICE_URL = os.environ.get(
    "EUROPEPMC_SERVICE_URL", "https://www.ebi.ac.uk/europepmc/webservices/rest/search"
)
GRAMENE_GENES_URL = os.environ.get(
    "GRAMENE_GENES_URL", "http://data.gramene.org/v58/genes")

# --- LLM chat configuration (new /api/llm/ endpoint) ----------------------
# "anthropic", "openai", or "none"
LLM_PROVIDER = os.environ.get("LLM_PROVIDER", "none")
LLM_API_KEY = os.environ.get("LLM_API_KEY", "")
LLM_MODEL = os.environ.get("LLM_MODEL", "claude-sonnet-5")

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
    # No database/user model is configured (see DATABASES above) — the API
    # is entirely unauthenticated, mirroring the legacy app (whose Basic-auth
    # filter was registered but never wired to any endpoint).
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    # Avoid importing django.contrib.auth.models.AnonymousUser, which would
    # require the (unused, un-migrated) auth app to be installed.
    "UNAUTHENTICATED_USER": None,
    "DEFAULT_PAGINATION_CLASS": None,
    "EXCEPTION_HANDLER": "core.exceptions.agrold_exception_handler",
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SPECTACULAR_SETTINGS = {
    "TITLE": "AgroLD API",
    "DESCRIPTION": "REST API over the AgroLD plant genomics/agronomy knowledge graph.",
    "VERSION": API_VERSION,
    "SERVE_INCLUDE_SCHEMA": False,
}

CORS_ALLOWED_ORIGINS = [
    o.strip()
    for o in os.environ.get(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:3001,http://localhost:5173,"
    ).split(",")
    if o.strip()
]
# The Vue dev server's port varies by environment (3000 by default, but
# whatever's free), and a frontend can also be reached through a tunnel
# (ngrok, etc.) whose hostname isn't known in advance. This API serves only
# public, read-only AgroLD data — the same fully open, unauthenticated
# surface as the original app (see core/exceptions.py) — so defaulting to
# allow-all here is a defensible tradeoff for not having to keep chasing
# origins by hand. Set CORS_ALLOW_ALL_ORIGINS=false and list explicit
# origins in CORS_ALLOWED_ORIGINS instead if that's not acceptable for your
# deployment.
CORS_ALLOW_ALL_ORIGINS = os.environ.get(
    "CORS_ALLOW_ALL_ORIGINS", "true").lower() == "true"

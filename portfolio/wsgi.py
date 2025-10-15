from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise
from pathlib import Path
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "portfolio.settings")

application = get_wsgi_application()
BASE_DIR = Path(__file__).resolve().parent.parent
application = WhiteNoise(application, root=BASE_DIR / "staticfiles")

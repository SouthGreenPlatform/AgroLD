from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView

from core.views import api_root

urlpatterns = [
    path("api/", api_root, name="api-root"),
    path("api/openapi.json", SpectacularAPIView.as_view(), name="openapi-schema"),
    path("api/", include("graphs.urls")),
    path("api/genes/", include("genes.urls")),
    path("api/proteins/", include("proteins.urls")),
    path("api/qtls/", include("qtls.urls")),
    path("api/pathways/", include("pathways.urls")),
    path("api/ontologies/", include("ontologies.urls")),
    path("api/llm/", include("llm.urls")),
]

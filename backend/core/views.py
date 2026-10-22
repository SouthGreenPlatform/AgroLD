from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def api_root(request):
    """API index — replaces the old `/api/` -> api-doc.jsp redirect."""
    return Response(
        {
            "name": "AgroLD API",
            "version": settings.API_VERSION,
            "instance": settings.AGROLD_INSTANCE,
            "faceted_search_url": settings.FACETED_SEARCH_URL,
            "rel_finder_url": settings.RF_LINK,
            "endpoints": {
                "genes": "/api/genes/",
                "proteins": "/api/proteins/",
                "qtls": "/api/qtls/",
                "pathways": "/api/pathways/",
                "ontologies": "/api/ontologies/",
                "graphs": "/api/graphs/",
                "describe": "/api/describe/?uri=<IRI>",
                "describe4visualization": "/api/describe4visualization/?uri=<IRI>",
                "predicates": "/api/predicates/",
                "sparql": "/api/sparql/?query=<SPARQL>",
                "llm": "/api/llm/",
            },
        }
    )

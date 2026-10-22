from rest_framework.response import Response
from rest_framework.views import exception_handler

from core.sparql_client import SparqlQueryError


def agrold_exception_handler(exc, context):
    if isinstance(exc, SparqlQueryError):
        return Response(
            {"error": "SPARQL query failed", "detail": str(exc)},
            status=502,
        )
    return exception_handler(exc, context)

from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.pagination import get_pagination
from core.sparql_client import clamp_timeout_ms, execute_select_raw

from . import dao


@api_view(["GET"])
def list_graphs(request):
    page, page_size = get_pagination(request)
    return Response(dao.list_graphs(page, page_size))


@api_view(["GET"])
def describe(request):
    page, page_size = get_pagination(request)
    uri = request.query_params.get("uri", "")
    return Response(dao.get_iri_description(uri, page, page_size))


@api_view(["GET"])
def describe4visualization(request):
    page, page_size = get_pagination(request)
    uri = request.query_params.get("uri", "")
    return Response(dao.get_iri_description_for_visualization(uri, page, page_size))


@api_view(["GET"])
def predicates(request):
    page, page_size = get_pagination(request)
    graph_local_name = request.query_params.get("graphLocalName")
    return Response(dao.get_predicates(graph_local_name, page, page_size))


@api_view(["GET"])
def sparql_proxy(request):
    """Raw SPARQL SELECT passthrough against the Virtuoso endpoint.

    Mirrors API.sparql: an open query proxy with no validation, kept for
    parity with the SPARQL Editor / query-pattern features in the frontend.
    """
    query = request.query_params.get("query", "")
    if not query:
        return Response({"error": "Missing required 'query' parameter"}, status=400)
    timeout = clamp_timeout_ms(request.query_params.get("timeout"), settings.SPARQL_QUERY_TIMEOUT)
    return Response(execute_select_raw(query, timeout=timeout))

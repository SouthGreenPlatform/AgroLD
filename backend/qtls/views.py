from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.pagination import get_pagination

from . import dao


@api_view(["GET"])
def list_qtls(request):
    page, page_size = get_pagination(request)
    return Response(dao.get_qtls(page, page_size))


@api_view(["GET"])
def qtls_by_keyword(request):
    page, page_size = get_pagination(request)
    keyword = request.query_params.get("keyword", "")
    return Response(dao.get_qtls_by_keyword(keyword, page, page_size))


@api_view(["GET"])
def qtl_ids_associated_with_onto_id(request):
    page, page_size = get_pagination(request)
    onto_id = request.query_params.get("ontoId", "")
    return Response(dao.get_qtl_id_associated_with_onto_id(onto_id, page, page_size))


@api_view(["GET"])
def qtls_associated_with_protein_id(request):
    page, page_size = get_pagination(request)
    protein_id = request.query_params.get("proteinId", "")
    return Response(dao.get_qtls_associated_with_protein_id(protein_id, page, page_size))

from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.pagination import get_pagination

from . import dao


@api_view(["GET"])
def list_proteins(request):
    page, page_size = get_pagination(request)
    return Response(dao.get_proteins(page, page_size))


@api_view(["GET"])
def proteins_by_keyword(request):
    page, page_size = get_pagination(request)
    keyword = request.query_params.get("keyword", "")
    return Response(dao.get_proteins_by_keyword(keyword, page, page_size))


@api_view(["GET"])
def proteins_associated_with_onto_id(request):
    page, page_size = get_pagination(request)
    onto_id = request.query_params.get("ontoId", "")
    return Response(dao.get_proteins_id_associated_with_onto_id(onto_id, page, page_size))


@api_view(["GET"])
def proteins_associated_with_qtl(request):
    page, page_size = get_pagination(request)
    qtl_id = request.query_params.get("qtlId", "")
    return Response(dao.get_proteins_associated_with_qtl(qtl_id, page, page_size))


@api_view(["GET"])
def proteins_encoded_by_gene(request):
    page, page_size = get_pagination(request)
    gene_id = request.query_params.get("geneId", "")
    return Response(dao.get_proteins_encoded_by_gene(gene_id, page, page_size))


@api_view(["GET"])
def publications_by_protein_id(request):
    protein_id = request.query_params.get("proteinId", "")
    return Response(dao.get_publications_of_protein_by_id(protein_id))

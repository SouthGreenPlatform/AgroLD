from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.pagination import get_pagination

from . import dao


@api_view(["GET"])
def ontology_terms_by_keyword(request):
    page, page_size = get_pagination(request)
    keyword = request.query_params.get("keyword", "")
    return Response(dao.get_ontology_terms_by_keyword(keyword, page, page_size))


@api_view(["GET"])
def ancestors_by_id(request):
    page, page_size = get_pagination(request)
    term_id = request.query_params.get("id", "")
    level = int(request.query_params.get("level", 1))
    return Response(dao.get_ancestor_by_id(term_id, level, page, page_size))


@api_view(["GET"])
def parent_by_id(request):
    page, page_size = get_pagination(request)
    term_id = request.query_params.get("id", "")
    return Response(dao.get_ancestor_by_id(term_id, 1, page, page_size))


@api_view(["GET"])
def descendants_by_id(request):
    page, page_size = get_pagination(request)
    term_id = request.query_params.get("id", "")
    level = int(request.query_params.get("level", 1))
    return Response(dao.get_descendants_by_id(term_id, level, page, page_size))


@api_view(["GET"])
def children_by_id(request):
    page, page_size = get_pagination(request)
    term_id = request.query_params.get("id", "")
    return Response(dao.get_descendants_by_id(term_id, 1, page, page_size))


@api_view(["GET"])
def id_by_term(request):
    page, page_size = get_pagination(request)
    onto_term = request.query_params.get("ontoTerm", "")
    return Response(dao.get_id_by_onto_term(onto_term, page, page_size))


@api_view(["GET"])
def term_by_id(request):
    page, page_size = get_pagination(request)
    term_id = request.query_params.get("id", "")
    return Response(dao.get_onto_term_by_id(term_id, page, page_size))


@api_view(["GET"])
def terms_associated_with_qtl(request):
    page, page_size = get_pagination(request)
    qtl_id = request.query_params.get("qtlId", "")
    return Response(dao.get_onto_terms_associated_with_qtl(qtl_id, page, page_size))


@api_view(["GET"])
def terms_associated_with_protein(request):
    page, page_size = get_pagination(request)
    protein_id = request.query_params.get("proteinId", "")
    return Response(dao.get_onto_terms_associated_with_protein(protein_id, page, page_size))


@api_view(["GET"])
def terms_associated_with_gene(request):
    gene_id = request.query_params.get("geneId", "")
    return Response(dao.get_onto_terms_associated_with_gene(gene_id))

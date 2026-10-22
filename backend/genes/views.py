from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.pagination import get_pagination

from . import dao


@api_view(["GET"])
def list_genes(request):
    page, page_size = get_pagination(request)
    return Response(dao.get_genes(page, page_size))


@api_view(["GET"])
def genes_by_keyword(request):
    page, page_size = get_pagination(request)
    keyword = request.query_params.get("keyword", "")
    return Response(dao.get_genes_by_keyword(keyword, page, page_size))


@api_view(["GET"])
def genes_encoding_protein(request):
    page, page_size = get_pagination(request)
    protein_id = request.query_params.get("proteinId", "")
    return Response(dao.get_genes_encoding_protein(protein_id, page, page_size))


@api_view(["GET"])
def genes_by_locus(request):
    page, page_size = get_pagination(request)
    return Response(
        dao.get_genes_by_locus(
            request.query_params.get("chromosomeNum", ""),
            request.query_params.get("chromosomeStart", ""),
            request.query_params.get("chromosomeEnd", ""),
            page,
            page_size,
        )
    )


@api_view(["GET"])
def genes_participating_in_pathway(request):
    page, page_size = get_pagination(request)
    pathway_id = request.query_params.get("pathwayId", "")
    return Response(dao.get_genes_by_pathway_id(pathway_id, page, page_size))


@api_view(["GET"])
def number_of_cds(request):
    page, page_size = get_pagination(request)
    return Response(dao.get_cds_gene(page, page_size))


@api_view(["GET"])
def publications_by_gene_id(request):
    page, page_size = get_pagination(request)
    gene_id = request.query_params.get("geneId", "")
    return Response(dao.get_publications_of_gene_by_id(gene_id, page, page_size))


@api_view(["GET"])
def see_also(request):
    page, page_size = get_pagination(request)
    gene_uri = request.query_params.get("geneUri", "")
    return Response(dao.get_see_also_by_uri(gene_uri, page, page_size))

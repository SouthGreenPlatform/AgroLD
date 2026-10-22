from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.pagination import get_pagination

from . import dao


@api_view(["GET"])
def pathways_by_keyword(request):
    page, page_size = get_pagination(request)
    keyword = request.query_params.get("keyword", "")
    return Response(dao.get_pathways_by_keyword(keyword, page, page_size))


@api_view(["GET"])
def pathways_participating_gene(request):
    page, page_size = get_pagination(request)
    gene_id = request.query_params.get("geneId", "")
    return Response(dao.get_pathways_in_which_participates_gene(gene_id, page, page_size))

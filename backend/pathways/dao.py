"""
SPARQL query builders for the Pathway domain.

Ported from agrold.webservices.dao.PathwayDAO.
"""
from __future__ import annotations

from core.sparql_client import add_limit_offset, execute_select, keyword_search, types_union
from genes.dao import TYPE_URIS as GENE_TYPE_URIS

PATHWAY_TYPE1 = "http://semanticscience.org/resource/SIO_010532"
PATHWAY_IDENTIFIER = "http://purl.agrold.org/vocabulary/Pathway_Identifier"
METABOLIC_PATHWAY = "http://purl.agrold.org/vocabulary/Metabolic_Pathway"
TYPE_URIS = [METABOLIC_PATHWAY, PATHWAY_IDENTIFIER, PATHWAY_TYPE1]


def get_pathways_by_keyword(keyword: str, page: int, page_size: int) -> list[dict]:
    return keyword_search(keyword, TYPE_URIS, page, page_size)


def get_pathways_in_which_participates_gene(gene_id: str, page: int, page_size: int) -> list[dict]:
    query = (
        "BASE <http://purl.agrold.org/>\n"
        "PREFIX vocab:<vocabulary/>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "\n"
        "SELECT DISTINCT ?pathwayId ?Name (?pathway AS ?IRI)\n"
        "WHERE {\n"
        "  ?gene vocab:is_agent_in ?pathway. \n"
        "  ?pathway rdfs:label ?Name. \n"
        "  BIND(REPLACE(str(?pathway), '^.*(#|/)', \"\") AS ?pathwayId) .\n"
        "  BIND(REPLACE(str(?gene), '^.*(#|/)', \"\") AS ?geneId) .\n"
        f"  FILTER(lcase('{gene_id}') = lcase(?geneId)).\n"
        f"{types_union('?gene', GENE_TYPE_URIS)}"
        f"{types_union('?pathway', TYPE_URIS)}"
        "}"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)

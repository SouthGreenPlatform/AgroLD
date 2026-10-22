"""
SPARQL query builders for the QTL domain.

Ported from agrold.webservices.dao.QtlDAO.
"""
from __future__ import annotations

from core.sparql_client import add_limit_offset, execute_select, keyword_search

QTL_TYPE_URI = "http://purl.agrold.org/vocabulary/QTL"
QTL_TYPE_URI2 = "http://purl.obolibrary.org/obo/SO_0000771"
TYPE_URIS = [QTL_TYPE_URI, QTL_TYPE_URI2]


def get_qtls(page: int, page_size: int) -> list[dict]:
    # Restructured from the original DAO's single flat query (a property-path
    # type filter joined with two OPTIONALs feeding a group_concat) which
    # reliably timed out against the live dataset: group_concat + DISTINCT
    # forces Virtuoso to materialize *every* matching QTL before it can
    # apply LIMIT, and the rdf:type|rdfs:subClassOf + FILTER(?type IN (...))
    # combo makes the planner drop a fast join plan once combined with the
    # label OPTIONAL. Paginating first via UNION-based type matching (fast,
    # confirmed live), then aggregating has_trait only for that page's QTLs,
    # avoids both problems. ORDER BY DESC(?URI) is likewise dropped from the
    # query (also confirmed independently expensive here) and done in
    # Python instead, over the already-small paginated result.
    query = (
        "PREFIX agrold:<http://purl.agrold.org/vocabulary/> \n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "SELECT ?qtlId ?qtlName (group_concat(distinct ?d;separator=\"; \") as ?Description) ?URI\n"
        "WHERE {\n"
        "  {\n"
        "    SELECT DISTINCT ?qtl ?qtlName ?qtlId ?URI\n"
        "    WHERE {\n"
        f"      {{ ?qtl rdf:type <{QTL_TYPE_URI}> }}\n"
        "      UNION\n"
        f"      {{ ?qtl rdfs:subClassOf <{QTL_TYPE_URI}> }}\n"
        "      UNION\n"
        f"      {{ ?qtl rdf:type <{QTL_TYPE_URI2}> }}\n"
        "      UNION\n"
        f"      {{ ?qtl rdfs:subClassOf <{QTL_TYPE_URI2}> }}\n"
        "      OPTIONAL {?qtl rdfs:label ?qtlName .}\n"
        "      BIND(REPLACE(str(?qtl), '^.*(#|/)', \"\") AS ?qtlId) .\n"
        "      BIND(?qtl AS ?URI)\n"
        "    }\n"
        f"    LIMIT {page_size}\n"
        f"    OFFSET {page_size * page}\n"
        "  }\n"
        "  OPTIONAL { ?qtl agrold:has_trait ?d }\n"
        "}\n"
        "GROUP BY ?qtlId ?qtlName ?URI"
    )
    rows = execute_select(query)
    rows.sort(key=lambda row: row.get("URI") or "", reverse=True)
    return rows


def get_qtls_by_keyword(keyword: str, page: int, page_size: int) -> list[dict]:
    return keyword_search(keyword, TYPE_URIS, page, page_size)


def get_qtl_id_associated_with_onto_id(onto_id: str, page: int, page_size: int) -> list[dict]:
    query = (
        "BASE <http://purl.agrold.org/>\n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "SELECT DISTINCT ?qtlId (?qtl AS ?URI) ?qtlLabel (REPLACE(str(?predicate), '^.*(#|/)', \"\") AS ?Association) "
        "?ontoElt ?ontoLabel\n"
        "WHERE\n"
        "{\n"
        "  {\n"
        "    ?qtl ?predicate ?ontoElt .\n"
        "    ?ontoElt rdfs:subClassOf ?ontoEltClass.\n"
        f"    {{?qtl rdf:type <{QTL_TYPE_URI}>.}}\n"
        "    UNION\n"
        f"    {{?qtl rdfs:subClassOf <{QTL_TYPE_URI2}>.}}\n"
        "    optional {?ontoElt rdfs:label ?ontoLabel}\n"
        "    optional {?qtl rdfs:label ?qtlLabel}\n"
        "    BIND(REPLACE(str(?qtl), '^.*(#|/)', \"\") AS ?qtlId) .\n"
        f"    FILTER REGEX(STR(?ontoElt), CONCAT(REPLACE(\"{onto_id}\", \":\", \"_\"), \"$\"))\n"
        "    FILTER (?predicate != rdf:type && ?predicate != rdfs:subClassOf)\n"
        "  }\n"
        "}"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_qtls_associated_with_protein_id(protein_id: str, page: int, page_size: int) -> list[dict]:
    query = (
        "BASE <http://purl.agrold.org/>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "PREFIX vocab:<vocabulary/>\n"
        "PREFIX graph1:<protein.annotations>\n"
        "PREFIX graph2:<qtl.annotations>\n"
        f"PREFIX protein: <http://purl.uniprot.org/uniprot/{protein_id}>\n"
        "\n"
        "SELECT distinct ?Id ?Name (?qtl AS ?URI) \n"
        "WHERE {\n"
        " GRAPH graph1: {\n"
        "  protein: vocab:has_trait ?to.    \n"
        " }\n"
        " GRAPH graph2: {\n"
        "  ?qtl vocab:has_trait ?to.\n"
        "  ?qtl rdfs:label ?Name.\n"
        "  BIND(REPLACE(str(?qtl), '^.*(#|/)', \"\") AS ?Id) .\n"
        " }\n"
        "}\n"
        "ORDER BY ?Name"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)

"""
SPARQL query builders for the Protein domain.

Ported from agrold.webservices.dao.ProteinDAO.
"""
from __future__ import annotations

from core.external_services import (
    get_publications_from_europepmc_by_label,
    sort_publications_by_year_desc,
)
from core.sparql_client import add_limit_offset, execute_select, keyword_search

PROTEIN_TYPE_URI = "http://purl.obolibrary.org/obo/SO_0000104"
PROTEIN_TYPE_URI2 = "http://purl.agrold.org/vocabulary/Protein"
TYPE_URIS = [PROTEIN_TYPE_URI, PROTEIN_TYPE_URI2]


def get_proteins(page: int, page_size: int) -> list[dict]:
    # Restructured like qtls.dao.get_qtls: the original flat query (a
    # property-path type filter + group_concat over an OPTIONAL description)
    # took 5+ seconds and got worse under load, for the same reasons —
    # group_concat/DISTINCT forces full materialization before LIMIT, and
    # rdf:type|rdfs:subClassOf + FILTER(?type IN (...)) is a slow combo once
    # joined with other patterns. Paginate first (fast, UNION-based type
    # match), then aggregate description only for that page's proteins.
    query = (
        "prefix	agrold:<http://purl.agrold.org/vocabulary/> \n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "SELECT ?proteinId ?proteinName (group_concat(distinct ?d;separator=\"; \") as ?Description) ?URI\n"
        "WHERE {\n"
        "  {\n"
        "    SELECT DISTINCT ?s ?proteinId ?proteinName ?URI\n"
        "    WHERE {\n"
        f"      {{ ?s rdf:type <{PROTEIN_TYPE_URI}> }}\n"
        "      UNION\n"
        f"      {{ ?s rdfs:subClassOf <{PROTEIN_TYPE_URI}> }}\n"
        "      UNION\n"
        f"      {{ ?s rdf:type <{PROTEIN_TYPE_URI2}> }}\n"
        "      UNION\n"
        f"      {{ ?s rdfs:subClassOf <{PROTEIN_TYPE_URI2}> }}\n"
        "      ?s rdfs:label ?proteinName .\n"
        "      BIND(REPLACE(str(?s), '^.*(#|/)', \"\") AS ?proteinId)\n"
        "      BIND(?s AS ?URI)\n"
        "    }\n"
        f"    LIMIT {page_size}\n"
        f"    OFFSET {page_size * page}\n"
        "  }\n"
        "  OPTIONAL {?s agrold:description ?d}\n"
        "}\n"
        "GROUP BY ?proteinId ?proteinName ?URI"
    )
    return execute_select(query)


def get_proteins_by_keyword(keyword: str, page: int, page_size: int) -> list[dict]:
    return keyword_search(keyword, TYPE_URIS, page, page_size)


def get_proteins_id_associated_with_onto_id(onto_id: str, page: int, page_size: int) -> list[dict]:
    query = (
        " BASE <http://purl.agrold.org/> \n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        " PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "SELECT DISTINCT ?proteinId (REPLACE(str(?predicate), '^.*(#|/)', \"\") AS ?Association) (?protein AS ?URI) \n"
        " WHERE \n"
        "{ \n"
        "    {  \n"
        "SELECT ?ontoElt \n"
        " WHERE \n"
        " { \n"
        "    ?ontoElt rdfs:subClassOf ?ontoEltClass. \n"
        f"     FILTER REGEX(STR(?ontoElt), CONCAT(REPLACE(\"{onto_id}\", \":\", \"_\"), \"$\")) \n"
        "   } limit 1 \n"
        " }  \n"
        " ?protein ?predicate ?ontoElt . \n"
        f" ?protein rdf:type <{PROTEIN_TYPE_URI2}>. \n"
        " BIND(REPLACE(str(?protein), '^.*(#|/)', \"\") AS ?proteinId) . \n"
        " }"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_proteins_associated_with_qtl(qtl_id: str, page: int, page_size: int) -> list[dict]:
    query = (
        "BASE <http://purl.agrold.org/>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "PREFIX vocab:<vocabulary/>\n"
        "PREFIX graph1:<protein.annotations>\n"
        "PREFIX graph2:<qtl.annotations>\n"
        f"PREFIX qtl: <http://www.identifiers.org/gramene.qtl/{qtl_id}>\n"
        "\n"
        "SELECT distinct ?Id ?Name (?protein AS ?URI) \n"
        "WHERE {\n"
        " GRAPH graph1: {\n"
        "  ?protein vocab:has_trait ?to.\n"
        "  ?protein rdfs:label ?Name.\n"
        "    BIND(REPLACE(str(?protein), '^.*(#|/)', \"\") AS ?Id) .\n"
        " }\n"
        " GRAPH graph2: {\n"
        "  qtl: vocab:has_trait ?to.\n"
        " }\n"
        "}\n"
        "ORDER BY ?Name"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_proteins_encoded_by_gene(gene_id: str, page: int, page_size: int) -> list[dict]:
    query = (
        "BASE <http://purl.agrold.org/>\n"
        "PREFIX vocab: <vocabulary/>\n"
        f"PREFIX gene: <http://purl.agrold.org/resource/{gene_id}>\n"
        "SELECT DISTINCT ?Id ?Name group_concat(distinct ?d;separator=\"; \") as ?Description (?protein AS ?URI)\n"
        "WHERE{\n"
        "  gene: vocab:encodes ?protein.\n"
        "  ?protein rdfs:label ?Name.\n"
        "  OPTIONAL {?protein vocab:description ?d}\n"
        "  BIND(REPLACE(str(?protein), '^.*(#|/)', \"\") AS ?Id) .\n"
        "}"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_protein_labels(protein_id: str) -> set[str]:
    query = (
        "prefix	agrold:<http://purl.agrold.org/vocabulary/> \n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "SELECT distinct ?label\n"
        "WHERE {\n"
        "  ?protein rdf:type|rdfs:subClassOf ?type.\n"
        "  ?protein rdfs:label ?label . \n"
        f"  FILTER(?type IN (<{PROTEIN_TYPE_URI}>,<{PROTEIN_TYPE_URI2}>))\n"
        "    BIND(REPLACE(str(?protein), '^.*(#|/)', \"\") AS ?id) .\n"
        f"    FILTER REGEX(STR(?id), \"{protein_id}\")\n"
        "}"
    )
    rows = execute_select(query)
    labels = {row["label"] for row in rows if row.get("label")}
    if labels:
        labels.add(protein_id)
    return labels


def get_publications_of_protein_by_id(protein_id: str) -> list[dict]:
    results: list[dict] = []
    for label in get_protein_labels(protein_id):
        results.extend(get_publications_from_europepmc_by_label(label))
    return sort_publications_by_year_desc(results)

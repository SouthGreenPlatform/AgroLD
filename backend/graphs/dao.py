"""
SPARQL query builders for generic graph/resource introspection.

Ported from agrold.webservices.dao.GeneralServicesDAO. Two fixes applied
versus the original Java (kept here as comments for traceability):

  - getIRIDescription's SPARQL had an unclosed `{` and an unbound ?graph
    variable in its SELECT clause; both are corrected here using the same
    GRAPH-scoped pattern already used by the visualization variant.
  - getIRIDescription4visualization no longer writes a debug result.json
    file to the working directory (a leftover side effect in the original).
"""
from __future__ import annotations

import re

from core.sparql_client import add_limit_offset, execute_select


def get_iri_description(iri: str, page: int, page_size: int) -> list[dict]:
    query = (
        "BASE <http://www.southgreen.fr/agrold/>\n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "SELECT ?graph ?property ?hasValue ?isValueOf "
        "(group_concat(distinct concat(?hasValueType, ?isValueOfType) ;separator=\"; \") as ?type)\n"
        "WHERE {\n"
        f"  values (?q){{(<{iri}>)}}\n"
        "  {\n"
        "    GRAPH ?graph { ?q ?property ?hasValue. FILTER(?hasValue != <http://www.w3.org/2002/07/owl#Class>) }\n"
        "    OPTIONAL {\n"
        "      ?hasValue a ?hasValueType.\n"
        "      FILTER(?hasValueType != <http://www.w3.org/2002/07/owl#Class>)\n"
        "    }\n"
        "  }\n"
        "  UNION\n"
        "  {\n"
        "    GRAPH ?graph { ?isValueOf ?property ?q. FILTER(?isValueOf != <http://www.w3.org/2002/07/owl#Class>) }\n"
        "    OPTIONAL {\n"
        "      ?isValueOf a ?isValueOfType.\n"
        "      FILTER(?isValueOfType != <http://www.w3.org/2002/07/owl#Class>)\n"
        "    }\n"
        "  }\n"
        "}\n"
        "GROUP BY ?graph ?property ?hasValue ?isValueOf"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_iri_description_for_visualization(iri: str, page: int, page_size: int) -> list[dict]:
    """Describe an IRI shaped for KnetMaps graph visualization: separate
    has-value / is-value-of passes, concatenated."""
    query_has_value = (
        "BASE <http://www.southgreen.fr/agrold/>\n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "SELECT ?graph ?property ?hasValue ?isValueOf (group_concat(distinct concat(?hasValueType) ;separator=\"; \") as ?type)\n"
        "WHERE {\n"
        f"values (?q){{(<{iri}>)}}\n"
        "    GRAPH ?graph { ?q ?property ?hasValue. FILTER(?hasValue != <http://www.w3.org/2002/07/owl#Class>)} \n"
        "    OPTIONAL{\n"
        "      ?hasValue a ?hasValueType.\n"
        "      FILTER(?hasValueType != <http://www.w3.org/2002/07/owl#Class>)\n"
        "    }\n"
        "}\n"
        "GROUP BY ?graph ?property ?hasValue ?isValueOf"
    )
    query_has_value = add_limit_offset(query_has_value, page, page_size)
    results_has_value = execute_select(query_has_value)

    query_is_value_of = (
        "BASE <http://www.southgreen.fr/agrold/>\n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "SELECT ?graph ?property ?hasValue ?isValueOf (group_concat(distinct concat(?isValueOfType) ;separator=\"; \") as ?type)\n"
        "WHERE {\n"
        f"values (?q){{(<{iri}>)}}\n"
        " GRAPH ?graph { ?isValueOf ?property ?q. FILTER(?isValueOf != <http://www.w3.org/2002/07/owl#Class>)} \n"
        "    OPTIONAL{\n"
        "      ?isValueOf a ?isValueOfType.\n"
        "      FILTER(?isValueOfType != <http://www.w3.org/2002/07/owl#Class>)\n"
        "    }  \n"
        "}\n"
        "GROUP BY ?graph ?property ?hasValue ?isValueOf"
    )
    query_is_value_of = add_limit_offset(query_is_value_of, page, page_size)
    results_is_value_of = execute_select(query_is_value_of)

    return results_has_value + results_is_value_of


def list_graphs(page: int, page_size: int) -> list[dict]:
    # Deliberately no FILTER (the legacy Java query's namespace filter, "
    # http://www.southgreen.fr/agrold/", no longer matches AgroLD's actual
    # graph URIs under purl.agrold.org anyway) and no ORDER BY: on this
    # Virtuoso instance, either clause makes the query planner abandon a
    # near-instant graph-enumeration shortcut in favor of a full quad-store
    # scan that reliably exceeds the query timeout. The graph count is small
    # (a few dozen), so sort and paginate in Python instead.
    query = (
        "SELECT distinct ?graph\n"
        "WHERE {\n"
        " GRAPH ?graph {\n"
        "   ?subject ?predicate ?object.\n"
        " }\n"
        "}"
    )
    rows = execute_select(query)
    rows.sort(key=lambda row: row.get("graph") or "")
    if page_size and page_size > 0:
        start = page_size * page
        rows = rows[start : start + page_size]
    return rows


def get_predicates(graph_local_name: str | None, page: int, page_size: int) -> list[dict]:
    # Projecting a BIND-computed ?LocalName alongside ?relation in the
    # SELECT DISTINCT list (as the original did) makes Virtuoso fall back to
    # a full quad-store scan when the query isn't scoped to one graph —
    # 20s+, timing out. Projecting only ?relation keeps its fast built-in
    # "distinct predicate" path (confirmed live, ~6s worst case across the
    # whole store, near-instant when scoped to one graph); LocalName is then
    # just a string op, computed in Python instead.
    has_graph = bool(graph_local_name)
    query = (
        "BASE <http://www.southgreen.fr/agrold/>\n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        + (f"PREFIX graph:<{graph_local_name}>\n" if has_graph else "")
        + "\n"
        "SELECT distinct ?relation\n"
        + ("FROM graph:\n" if has_graph else "")
        + "WHERE { \n"
        "  ?subject ?relation ?object . \n"
        "} "
    )
    query = add_limit_offset(query, page, page_size)
    rows = execute_select(query)
    for row in rows:
        uri = row.pop("relation", None)
        row["URI"] = uri
        row["LocalName"] = re.sub(r"^.*[#/]", "", uri) if uri else uri
    rows.sort(key=lambda row: row.get("URI") or "")
    return rows

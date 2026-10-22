"""
SPARQL execution helpers for the AgroLD Virtuoso triplestore.

This replaces agrold.webservices.dao.Utils from the legacy JSP/JAX-RS
backend. The original hand-rolled HTTP GET + manual TSV->JSON conversion is
replaced with SPARQLWrapper requesting Virtuoso's native SPARQL-JSON results
format, then flattening bindings into plain dicts of {var: value} — the
shape the DRF views hand back to the frontend.
"""
from __future__ import annotations

from typing import Iterable

from django.conf import settings
from SPARQLWrapper import JSON as SPARQL_JSON
from SPARQLWrapper import SPARQLWrapper


class SparqlQueryError(Exception):
    """Raised when a query against the Virtuoso endpoint fails."""


# Bounds (seconds) for a client-supplied timeout override (e.g. from the
# SPARQL Editor's "Execution timeout" field via the /api/sparql/ proxy).
# Prevents an arbitrarily large value from tying up a worker indefinitely.
MIN_QUERY_TIMEOUT = 1
MAX_QUERY_TIMEOUT = 60


def clamp_timeout_ms(value: str | None, default_seconds: int) -> int:
    """Parse a client-supplied timeout (milliseconds) into clamped seconds."""
    if not value:
        return default_seconds
    try:
        seconds = int(value) / 1000
    except (TypeError, ValueError):
        return default_seconds
    return max(MIN_QUERY_TIMEOUT, min(MAX_QUERY_TIMEOUT, round(seconds)))


def _client(endpoint: str | None = None, timeout: int | None = None) -> SPARQLWrapper:
    timeout_seconds = timeout or settings.SPARQL_QUERY_TIMEOUT
    wrapper = SPARQLWrapper(endpoint or settings.SPARQL_ENDPOINT)
    wrapper.setReturnFormat(SPARQL_JSON)
    # Client-side socket timeout: Django won't hang past this even if
    # Virtuoso never responds.
    wrapper.setTimeout(timeout_seconds)
    # Virtuoso's own SPARQL-protocol extension parameter (milliseconds):
    # tells Virtuoso itself to abort query *execution* past this budget,
    # rather than just burning server CPU after our client gives up.
    # Mirrors Utils.executeSparqlQuery's hardcoded `&timeout=20000` in the
    # legacy Java app.
    wrapper.addParameter("timeout", str(timeout_seconds * 1000))
    return wrapper


def flatten_bindings(sparql_json_results: dict) -> list[dict]:
    """Turn a SPARQL-JSON results document into a list of flat {var: value} dicts."""
    bindings = sparql_json_results.get("results", {}).get("bindings", [])
    return [{key: cell.get("value") for key, cell in row.items()} for row in bindings]


def execute_select(query: str, endpoint: str | None = None, timeout: int | None = None) -> list[dict]:
    """Run a SPARQL SELECT query and return flattened result rows."""
    wrapper = _client(endpoint, timeout)
    wrapper.setQuery(query)
    try:
        results = wrapper.query().convert()
    except Exception as exc:  # network errors, timeouts, malformed queries, ...
        raise SparqlQueryError(str(exc)) from exc
    return flatten_bindings(results)


def execute_select_raw(query: str, endpoint: str | None = None, timeout: int | None = None) -> dict:
    """Run a SPARQL SELECT query and return the raw SPARQL-JSON results document.

    Used by the /api/sparql/ passthrough proxy, which mirrors the original
    Java API's open query endpoint.
    """
    wrapper = _client(endpoint, timeout)
    wrapper.setQuery(query)
    try:
        return wrapper.query().convert()
    except Exception as exc:
        raise SparqlQueryError(str(exc)) from exc


def add_limit_offset(query: str, page: int, page_size: int) -> str:
    """Append LIMIT/OFFSET clauses. Mirrors Utils.addLimitAndOffset: page is a
    page *number*, not a raw offset — offset = page_size * page."""
    if page_size and page_size > 0:
        query += f"\nLIMIT {page_size}"
        if page >= 0:
            query += f"\nOFFSET {page_size * page}"
    return query


def types_union(subject: str, type_uris: Iterable[str]) -> str:
    """Build a `{subject a <type>} UNION {subject a <type2>} ...` block.

    Mirrors Utils.getTypesOptionsAsSparql — a workaround for AgroLD entities
    being typed under more than one URI across data sources.
    """
    clauses = [f"{{{subject} a <{uri}>}}\n" for uri in type_uris]
    return "union\n".join(clauses)


def keyword_search(keyword: str, type_uris: Iterable[str], page: int, page_size: int) -> list[dict]:
    """Full-text keyword search across entities restricted to the given rdf:types.

    Mirrors Utils.getEntitiesByKeyWord: uses Virtuoso's free-text index
    (bif:contains) with a boolean AND over whitespace-separated tokens,
    ranked by Virtuoso's IRI rank.
    """
    tokens = keyword.split()
    keywords_query = "'(\"" + '" AND "'.join(t.upper() for t in tokens) + "\")'"
    keywords_list = "('" + "', '".join(t.upper() for t in tokens) + "')"

    query = (
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "select distinct ?Id ,?s1 as ?URI, ?g as ?graph, "
        f"(bif:search_excerpt (bif:vector {keywords_list}, group_concat(distinct ?o1;separator=\" ; \"))) as ?keyword_reference \n"
        "where {{{ \n"
        "select ?Id, ?s1, ?t, (?sc * 3e-1) as ?sc, ?o1, (sql:rnk_scale (<LONG::IRI_RANK> (?s1))) as ?rank, ?g \n"
        "where  \n"
        "  { \n"
        "    quad map virtrdf:DefaultQuadMap \n"
        "    { \n"
        "      graph ?g \n"
        "      { \n"
        "         ?s1 ?s1textp ?o1 .\n"
        f"        ?o1 bif:contains  {keywords_query}  option (score ?sc)  .\n"
        "      }\n"
        "     }\n"
        f"{types_union('?s1', type_uris)}"
        "	BIND(REPLACE(str(?s1), '^.*(#|/)', \"\") AS ?Id)\n"
        "  }\n"
        " order by desc (?sc * 3e-1 + sql:rnk_scale (<LONG::IRI_RANK> (?s1)))  "
    )
    query = add_limit_offset(query, page, page_size) + "}}}"
    return execute_select(query)

"""
SPARQL query builders for the Ontology domain.

Ported from agrold.webservices.dao.OntologyDAO.
"""
from __future__ import annotations

from core.external_services import get_onto_terms_associated_with_gene_gramene
from core.sparql_client import add_limit_offset, execute_select

# Named graph holding ontology term definitions in AgroLD. The legacy Java
# DAO scoped these queries to 7 separate per-ontology graphs
# (http://purl.agrold.org/{so,go,eco,eo,pato,po,to}); on the live dataset
# none of those exist (confirmed by direct SPARQL query) — every ontology
# term actually lives in this single graph instead, which is also why every
# query below returned zero rows before this fix, independent of timeouts.
ONTOLOGY_GRAPHS = ("http://purl.agrold.org/graph/obo.ontologies",)


def _from_clauses(graphs=ONTOLOGY_GRAPHS) -> str:
    return "".join(f"    FROM <{g}>\n" for g in graphs)


def get_ontology_terms_by_keyword(keyword: str, page: int, page_size: int) -> list[dict]:
    """Search ontology term ID, name, description and URI for a keyword match.

    keyword may itself be an ID (e.g. "EO:0007403") or a free-text term.
    """
    query = (
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "PREFIX meaning:<http://purl.obolibrary.org/obo/IAO_0000115>\n"
        "PREFIX hasExactSynonym:<http://www.geneontology.org/formats/oboInOwl#hasExactSynonym>\n"
        "SELECT distinct ?Id (str(?name) AS ?Name) (str(?description) AS ?Description) (?term as ?URI)\n"
        f"{_from_clauses()}"
        "WHERE {   \n"
        "VALUES ?keyword {\n"
        f"    \"{keyword}\" \n"
        "  } \n"
        "    {?term meaning: ?description} UNION {BIND(\"\" AS ?description)}  \n"
        "  {?term rdfs:label ?name.} UNION  {?term hasExactSynonym: ?name.}\n"
        "    BIND(REPLACE(str(?term), '^.*(#|/)', \"\") AS ?Localname)\n"
        "   	BIND(REPLACE(?Localname, \"_\", \":\") as ?Id)     \n"
        "    BIND ( CONCAT(?description, ?name, ?Id) AS ?text)   \n"
        "  FILTER(REGEX(?text, ?keyword,\"i\"))\n"
        "}"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_id_by_onto_term(onto_term: str, page: int, page_size: int) -> list[dict]:
    """ID of the ontology class whose rdfs:label exactly matches onto_term."""
    query = (
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n"
        "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n"
        "\n"
        "SELECT DISTINCT ?id (?subject AS ?URI)\n"
        f"{_from_clauses()}"
        "WHERE { \n"
        " {\n"
        "  SELECT ?subject\n"
        "  WHERE\n"
        "  {\n"
        f"   ?subject rdfs:label \"{onto_term}\"^^xsd:string .\n"
        "   ?subject a owl:Class ."
        "  }    \n"
        " }\n"
        " BIND(REPLACE(str(?subject), '^.*(#|/)', \"\") AS ?localname)\n"
        " BIND(REPLACE(?localname, \"_\", \":\") as ?id).\n"
        "} "
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_onto_term_by_id(term_id: str, page: int, page_size: int) -> list[dict]:
    query = (
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n"
        "SELECT DISTINCT ?OntoTerm  (?subject AS ?URI)\n"
        f"{_from_clauses()}"
        "WHERE { \n"
        " {\n"
        "  SELECT ?subject\n"
        "  WHERE\n"
        "  {\n"
        "   ?subject rdfs:subClassOf ?o.\n"
        f"   FILTER REGEX(STR(?subject), CONCAT(REPLACE(\"{term_id}\", \":\", \"_\"), \"$\"))\n"
        "  } LIMIT 1\n"
        " }\n"
        " ?subject rdfs:label ?OntoTerm .\n"
        "}  "
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_ancestor_by_id(term_id: str, level: int, page: int, page_size: int) -> list[dict]:
    """N-level ancestors (rdfs:subClassOf chain) of an ontology term."""
    i = 1
    pattern = ""
    while i < level:
        pattern += f"    ?ancestor{i} rdfs:subClassOf ?ancestor{i + 1}.\n"
        i += 1
    # The inner subquery resolves ?subject alone (LIMIT 1 is safe here: the
    # id should identify exactly one term) using a throwaway anchor
    # (?subject rdfs:subClassOf ?o — any parent at all, cheap+selective with
    # the id regex). The actual ancestor traversal happens *outside* that
    # limit, against the now-bound ?subject, so a term with multiple parents
    # still returns all of them — an earlier version limited the traversal
    # itself, which silently dropped ancestors for any multi-parent class.
    query = (
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n"
        f"SELECT DISTINCT ?ancestorId  (?ancestor{i} AS ?uri)\n"
        f"{_from_clauses()}"
        " WHERE \n"
        " {     \n"
        "  { \n"
        "    SELECT ?subject\n"
        "    WHERE\n"
        "    {\n"
        "    	?subject rdfs:subClassOf ?o.          	\n"
        f"  		FILTER REGEX(STR(?subject), CONCAT(REPLACE(\"{term_id}\", \":\", \"_\"), \"$\"))\n"
        "    } LIMIT 1\n"
        "  }\n"
        "    ?subject rdfs:subClassOf ?ancestor1.\n"
        f"{pattern}"
        f"   BIND(REPLACE(str(?ancestor{i}), '^.*(#|/)', \"\") AS ?ancestorLocalname)\n"
        "   BIND(REPLACE(?ancestorLocalname, \"_\", \":\") as ?ancestorId)\n"
        "}"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_descendants_by_id(term_id: str, level: int, page: int, page_size: int) -> list[dict]:
    """N-level descendants (rdfs:subClassOf chain) of an ontology term."""
    i = 1
    pattern = ""
    while i < level:
        pattern += f"    ?descendent{i + 1} rdfs:subClassOf ?descendent{i}.\n"
        i += 1
    # Same two-phase restructuring as get_ancestor_by_id, but the throwaway
    # anchor for resolving ?subject is "a owl:Class" rather than "has a
    # parent": a root-level term (children but no parent of its own) is a
    # valid, common case here, and would otherwise never match.
    query = (
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n"
        f"SELECT DISTINCT ?descendentId (?descendent{i} AS ?URI)\n"
        f"{_from_clauses()}"
        " WHERE \n"
        " {     \n"
        "  { \n"
        "    SELECT ?subject\n"
        "    WHERE\n"
        "    {\n"
        "    	?subject a owl:Class . \n"
        f"  		FILTER REGEX(STR(?subject), CONCAT(REPLACE(\"{term_id}\", \":\", \"_\"), \"$\"))\n"
        "    } LIMIT 1\n"
        "  }\n"
        "    ?descendent1 rdfs:subClassOf ?subject.\n"
        f"{pattern}"
        f"  ?descendent{i} a owl:Class .\n"
        f"   BIND(REPLACE(str(?descendent{i}), '^.*(#|/)', \"\") AS ?descendentLocalname)\n"
        "   BIND(REPLACE(?descendentLocalname, \"_\", \":\") as ?descendentId)\n"
        "}"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_onto_terms_associated_with_qtl(qtl_id: str, page: int, page_size: int) -> list[dict]:
    query = (
        "BASE <http://www.southgreen.fr/agrold/>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        f"PREFIX qtl: <http://www.identifiers.org/gramene.qtl/{qtl_id}>\n"
        "SELECT DISTINCT ?Id (str(?Name) as ?Name) ?Association (?Concept AS ?URI)\n"
        f"{_from_clauses(ONTOLOGY_GRAPHS + ('http://purl.agrold.org/graph/qtl.annotations', 'http://purl.agrold.org/graph/gramene.qtl'))}"
        "WHERE\n"
        "{\n"
        "   qtl: ?relation ?Concept.\n"
        "   BIND(REPLACE(str(?relation), '^.*(#|/)', \"\") AS ?Association)\n"
        "   FILTER(! regex(?Association, \"Object\", \"i\"))\n"
        "   ?Concept rdfs:label ?Name\n"
        "   BIND(REPLACE(str(?Concept), '^.*(#|/)', \"\") AS ?ConceptLocalname)\n"
        "   BIND(REPLACE(?ConceptLocalname, \"_\", \":\") as ?Id)\n"
        "}\n"
        "ORDER BY ?Association"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_onto_terms_associated_with_protein(protein_id: str, page: int, page_size: int) -> list[dict]:
    query = (
        "BASE <http://www.southgreen.fr/agrold/>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        f"PREFIX protein: <http://purl.uniprot.org/uniprot/{protein_id}>\n"
        "SELECT DISTINCT ?Id (str(?Name) as ?Name) ?Association (?Concept AS ?URI)\n"
        f"{_from_clauses()}"
        "WHERE\n"
        "{\n"
        "   protein: ?relation ?Concept.\n"
        "   BIND(REPLACE(str(?relation), '^.*(#|/)', \"\") AS ?Association)\n"
        "   FILTER(! regex(?Association, \"Object\", \"i\"))\n"
        "   ?Concept rdfs:label ?Name\n"
        "   BIND(REPLACE(str(?Concept), '^.*(#|/)', \"\") AS ?ConceptLocalname)\n"
        "   BIND(REPLACE(?ConceptLocalname, \"_\", \":\") as ?Id)\n"
        "}\n"
        "ORDER BY ?Association"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def _get_onto_terms_associated_with_gene_sparql(gene_id: str) -> list[dict]:
    query = (
        f"PREFIX uri:<http://purl.agrold.org/resource/{gene_id}>\n"
        "SELECT ?def (str(?name) as ?name) (str(?namespace) as ?namespace) (str(?id) as ?id) ?evidence_code ?subset\n"
        "WHERE {\n"
        "  {uri: <http://purl.obolibrary.org/obo/participates_in> ?ontoTermURI.}\n"
        "  UNION\n"
        "  {uri: <http://www.southgreen.fr/agrold/vocabulary/expressed_in> ?ontoTermURI.}\n"
        "  UNION\n"
        "  {uri: <http://purl.obolibrary.org/obo/located_in> ?ontoTermURI.}\n"
        "  UNION\n"
        "  {uri: <http://www.southgreen.fr/agrold/vocabulary/expressed_at> ?ontoTermURI.}\n"
        "  UNION\n"
        "  {uri: <http://purl.obolibrary.org/obo/has_function> ?ontoTermURI.}\n"
        "  ?ontoTermURI <http://purl.obolibrary.org/obo/IAO_0000115> ?def;\n"
        "  <http://www.w3.org/2000/01/rdf-schema#label> ?name;\n"
        "  <http://www.geneontology.org/formats/oboInOwl#id> ?id;\n"
        "  <http://www.geneontology.org/formats/oboInOwl#hasOBONamespace> ?namespace.\n"
        "}"
    )
    return execute_select(query)


def get_onto_terms_associated_with_gene(gene_id: str) -> list[dict]:
    """Merge Gramene's GO/PO/TO annotations for a gene with AgroLD's own
    local SPARQL annotations, de-duplicated by term id.

    Mirrors OntologyDAO.getOntoTermsAssociatedWithGene.
    """
    results = list(get_onto_terms_associated_with_gene_gramene(gene_id))
    seen_ids = {term.get("id") for term in results if term.get("id") is not None}

    for term in _get_onto_terms_associated_with_gene_sparql(gene_id):
        if term.get("id") not in seen_ids:
            results.append(term)
            seen_ids.add(term.get("id"))

    return results

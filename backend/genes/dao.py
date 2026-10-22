"""
SPARQL query builders for the Gene domain.

Ported from agrold.webservices.dao.GeneDAO (JAX-RS/JSP backend). Each
function mirrors its Java counterpart's SPARQL text as closely as possible.
"""
from __future__ import annotations

from core.external_services import (
    get_publications_from_europepmc_by_label,
    sort_publications_by_year_desc,
)
from core.sparql_client import add_limit_offset, execute_select, keyword_search, types_union

GENE_TYPE_URI = "http://purl.agrold.org/resource/Gene"
GENE_TYPE_URI2 = "http://purl.agrold.org/vocabulary/Gene"
TYPE_URIS = [GENE_TYPE_URI, GENE_TYPE_URI2]


def get_genes(page: int, page_size: int) -> list[dict]:
    query = (
        "prefix	agrold:<http://purl.agrold.org/vocabulary/> \n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "SELECT distinct ?gene ?geneId ?geneName ?geneDescription\n"
        "WHERE {\n"
        "  ?gene rdfs:label ?geneName.\n"
        "  ?gene agrold:description ?geneDescription.          \n"
        f"{types_union('?gene', TYPE_URIS)}"
        "  BIND(REPLACE(str(?gene), '^.*(#|/)', \"\") AS ?geneId) .\n"
        "}"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_genes_by_keyword(keyword: str, page: int, page_size: int) -> list[dict]:
    return keyword_search(keyword, TYPE_URIS, page, page_size)


def get_genes_by_pathway_id(pathway_id: str, page: int, page_size: int) -> list[dict]:
    """Genes participating in a pathway given its local name (Id)."""
    query = (
        "BASE <http://purl.agrold.org/>\n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "PREFIX vocab:<vocabulary/>\n"
        "PREFIX graph:<gramene.cyc>\n"
        "PREFIX taxonGraph:<ncbitaxon>\n"
        "SELECT DISTINCT ?geneId ?gene_name ?taxon (str(?taxon_name) AS ?taxon_name) (?gene AS ?URI)\n"
        "WHERE {\n"
        "    ?gene vocab:is_agent_in ?pathway.\n"
        "    BIND(REPLACE(str(?pathway), '^.*(#|/)', \"\") AS ?pathwayId) .\n"
        f"    FILTER REGEX(STR(?pathwayId), \"{pathway_id}\")"
        "    ?gene rdfs:label ?gene_name.\n"
        "    ?gene vocab:taxon ?taxon.\n"
        "    BIND(REPLACE(str(?gene), '^.*(#|/)', \"\") AS ?geneId) .\n"
        "    ?taxon rdfs:label ?taxon_name.\n"
        f"{types_union('?gene', TYPE_URIS)}"
        "}"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_genes_encoding_protein(protein_id: str, page: int, page_size: int) -> list[dict]:
    query = (
        "BASE <http://purl.agrold.org/>\n"
        "PREFIX vocab: <vocabulary/>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        f"PREFIX protein: <http://purl.uniprot.org/uniprot/{protein_id}>\n"
        "SELECT DISTINCT ?Id group_concat(distinct ?Name;separator=\"; \") as ?Names "
        "group_concat(distinct ?d;separator=\"; \") as ?Description (?gene AS ?URI)\n"
        "WHERE{\n"
        "  ?gene vocab:encodes protein:.\n"
        "  OPTIONAL{?gene rdfs:label ?Name.}\n"
        "  OPTIONAL{?gene vocab:description ?d}\n"
        "  BIND(REPLACE(str(?gene), '^.*(#|/)', \"\") AS ?Id) .\n"
        f"{types_union('?gene', TYPE_URIS)}"
        "}"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_cds_gene(page: int, page_size: int) -> list[dict]:
    """Count of CDS features per mRNA. Experimental/unfinished in the
    original app (flagged as WIP in its README); kept for parity."""
    query = (
        "BASE <http://purl.agrold.org/>\n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "PREFIX obo:<http://purl.obolibrary.org/obo/>\n"
        "PREFIX uniprot:<http://purl.uniprot.org/uniprot/>\n"
        "PREFIX vocab:<vocabulary/>\n"
        "PREFIX graph:<protein.annotations>\n"
        "PREFIX id:<http://identifiers.org/ensembl.plant/BGIOSGA000040>\n"
        "PREFIX agrold_schema:<http://www.southgreen.fr/agrold/resource/>\n"
        "SELECT (COUNT(DISTINCT ?cds) AS ?count)\n"
        "WHERE {\n"
        "GRAPH ?g {\n"
        "?mrna  rdf:type  agrold_schema:mRNA .\n"
        "?mrna ?p id: .\n"
        "?cds ?p2 ?mrna.\n"
        "?cds  rdf:type  agrold_schema:CDS .\n"
        "?cds vocab:has_start_position ?st .\n"
        "?cds vocab:has_end_position ?end .\n"
        "?cds vocab:is_located_on ?chrm.\n"
        "} \n"
        "}"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_genes_by_locus(
    chromosome_num: str, chromosome_start: str, chromosome_end: str, page: int, page_size: int
) -> list[dict]:
    query = (
        "BASE <http://purl.agrold.org/>\n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "PREFIX vocab: <vocabulary/>\n"
        "PREFIX obo:<http://purl.obolibrary.org/obo/> \n"
        "PREFIX chrom: <chromosome/>\n"
        "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n"
        "SELECT DISTINCT ?genes ?start ?taxon_name \n"
        "WHERE{\n"
        "?genes rdf:type <http://purl.agrold.org/vocabulary/Gene>.\n"
        f"?genes vocab:is_located_on chrom:{chromosome_num} .\n"
        "?genes vocab:taxon ?taxon_name .\n"
        "?genes vocab:has_start_position ?start_position .\n"
        "bind(xsd:int(?start_position) as ?start)\n"
        f"FILTER(?start >= {chromosome_start} && ?start <= {chromosome_end})\n"
        "}"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_gene_labels(gene_id: str) -> set[str]:
    query = (
        "prefix	agrold:<http://purl.agrold.org/vocabulary/> \n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "SELECT distinct ?label\n"
        "WHERE {\n"
        "    ?gene rdfs:label ?label.\n"
        f"{types_union('?gene', TYPE_URIS)}"
        "    BIND(REPLACE(str(?gene), '^.*(#|/)', \"\") AS ?id) .\n"
        f"    FILTER REGEX(STR(?id), \"{gene_id}\")\n"
        "}"
    )
    rows = execute_select(query)
    labels = {row["label"] for row in rows if row.get("label")}
    if labels:
        labels.add(gene_id)
    return labels


def get_publications_of_gene_by_id(gene_id: str, page: int, page_size: int) -> list[dict]:
    """Publications referencing a gene, via a dedicated RAP-DB cross-reference query."""
    query = (
        "BASE <http://purl.agrold.org/>\n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "PREFIX graph:<rapdb>\n"
        "PREFIX vocab:<vocabulary/>\n"
        "PREFIX res:<resource/>\n"
        "\n"
        "SELECT DISTINCT ?publication\n"
        "WHERE {\n"
        "graph graph: {\n"
        "    ?mRNA vocab:develops_from|res:SIO_010081 ?gene;\n"
        "	<http://purl.org/dc/terms/references> ?publication.\n"
        f"{types_union('?gene', TYPE_URIS)}"
        "    BIND(REPLACE(str(?gene), '^.*(#|/)', \"\") AS ?geneId) .\n"
        f"    FILTER regex(str(?geneId), '{gene_id}') .\n"
        "}\n"
        "}"
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)


def get_publications_of_gene_by_label(gene_id: str) -> list[dict]:
    """Publications for a gene, fanned out across EuropePMC by each of its
    known labels. Mirrors the (originally commented-out) label-based path
    in GeneDAO.getPublicationsOfGeneById."""
    results: list[dict] = []
    for label in get_gene_labels(gene_id):
        results.extend(get_publications_from_europepmc_by_label(label))
    return sort_publications_by_year_desc(results)


def get_see_also_by_uri(gene_uri: str, page: int, page_size: int) -> list[dict]:
    query = (
        "BASE <http://purl.agrold.org/>\n"
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
        "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
        "SELECT distinct ?link\n"
        "WHERE { \n"
        f"  <{gene_uri}> rdfs:seeAlso|<vocabulary/has_dbxref> ?link .\n"
        f"{types_union(f'<{gene_uri}>', TYPE_URIS)}"
        "} "
    )
    query = add_limit_offset(query, page, page_size)
    return execute_select(query)

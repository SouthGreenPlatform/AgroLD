"""
External REST integrations used to enrich AgroLD entities.

Replaces agrold.webservices.dao.ExternalServices:
- EuropePMC: publications matching a gene/protein label.
- Gramene: GO/PO/TO ontology annotations for a gene.
"""
from __future__ import annotations

import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

REQUEST_TIMEOUT = 15


def get_publications_from_europepmc_by_label(label: str) -> list[dict]:
    """Search EuropePMC for publications referencing the given label.

    Mirrors ExternalServices.getPublicationsFromEBIEuropePMCByLabel, but
    consumes EuropePMC's native JSON response instead of hand-parsing XML.
    """
    params = {
        "query": f"{label} sort_date:y",
        "pageSize": 100,
        "format": "json",
    }
    try:
        response = requests.get(settings.EUROPEPMC_SERVICE_URL, params=params, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
    except requests.RequestException:
        logger.exception("EuropePMC lookup failed for label %r", label)
        return []

    data = response.json()
    return data.get("resultList", {}).get("result", [])


def sort_publications_by_year_desc(publications: list[dict]) -> list[dict]:
    """Mirrors Utils.sortJSONArray(..., "pubYear", false)."""
    return sorted(publications, key=lambda pub: pub.get("pubYear", ""), reverse=True)


def get_onto_terms_associated_with_gene_gramene(gene_id: str) -> list[dict]:
    """Fetch GO/PO/TO annotations for a gene from the Gramene REST API.

    Mirrors ExternalServices.getOntoTermsAssociatedWithGene.
    """
    url = settings.GRAMENE_GENES_URL
    params = {"q": gene_id, "bedFeature": "gene", "bedCombiner": "canonical"}
    try:
        response = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
    except requests.RequestException:
        logger.exception("Gramene lookup failed for gene %r", gene_id)
        return []

    try:
        results = response.json()
    except ValueError:
        return []

    for entry in results:
        if str(entry.get("_id", "")).lower() != gene_id.lower():
            continue
        annotations = entry.get("annotations", {})
        for onto in ("GO", "PO", "TO"):
            if onto in annotations:
                return annotations[onto].get("entries", [])
    return []

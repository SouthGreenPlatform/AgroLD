"""
Backend for the SPARQL-assistant chat feature (src/views/ChatPage.vue).

This is new functionality — there is no equivalent in the legacy JSP app.
The frontend already calls `POST /api/llm` with `{message}` and reads back
`{reply}`; this module implements that contract against a pluggable
provider selected via the LLM_PROVIDER env var.

Responses are grounded in live data where possible: if the user's message
references a recognized AgroLD/linked-data entity URI, we fetch a Concise
Bounded Description (CBD) of that entity straight from the SPARQL endpoint
— the standard RDF notion of "all triples with this resource as subject or
object, not traversed further" (see graphs.dao.get_iri_description, which
already implements exactly that query shape) — and hand it to the model as
context, capped to a small triple count to keep it both genuinely *concise*
and cheap to send on every turn.
"""
from __future__ import annotations

import logging
import re

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are the AgroLD assistant. AgroLD is a knowledge graph about plant "
    "genomics and agronomy (genes, proteins, QTLs, pathways, ontology terms) "
    "queryable via SPARQL against a Virtuoso triplestore. Help users write "
    "and understand SPARQL queries and explore AgroLD data.\n\n"
    "Format every response in Markdown: use **bold** for key terms and "
    "entity names, bullet or numbered lists for multi-item answers, and "
    "short ## headers to separate sections in longer answers. Any SPARQL "
    "query you write MUST be in its own fenced code block tagged sparql, "
    "e.g.:\n"
    "```sparql\n"
    "SELECT ?s WHERE { ?s a <http://example.org/Type> } LIMIT 10\n"
    "```\n"
    "Keep prose concise and let the formatting carry the structure."
)

CONTEXT_INSTRUCTION = (
    "The user's message references an AgroLD entity. Below is a Concise "
    "Bounded Description of it — the actual RDF triples for that resource, "
    "fetched live from the SPARQL endpoint just now. Ground your answer in "
    "this data and prefer it over prior knowledge; if it doesn't contain "
    "enough information to answer, say so plainly rather than guessing.\n\n"
)

# Only fire a live entity lookup for URIs in namespaces AgroLD actually
# uses. A bare "any http(s) URL in the message" match would also trigger on
# the SPARQL endpoint URL itself — the SPARQL Editor's "Generate"/"Explain"
# actions both embed it in their prompt — which isn't an entity to describe.
KNOWN_ENTITY_PREFIXES = (
    "http://purl.agrold.org/",
    "http://purl.obolibrary.org/obo/",
    "http://purl.uniprot.org/uniprot/",
    "http://www.identifiers.org/",
    "http://identifiers.org/",
    "http://www.southgreen.fr/agrold/",
)

URI_PATTERN = re.compile(r"<?(https?://[^\s<>\"')\]]+)>?")

# Keeps the description genuinely "concise" (small enough to always afford
# in the prompt) as well as bounded (no recursive traversal beyond this
# resource's own triples) — the two senses of CBD.
CBD_MAX_TRIPLES = 40

# Words to strip before picking a search keyword out of a free-text chat
# message — mostly the question/instruction scaffolding around the actual
# entity name ("tell me about X", "what is X", ...). Without this, every
# token of the message would need to match (keyword_search ANDs them all
# via bif:contains), which tanks recall on ordinary questions.
_STOPWORDS = {
    "a", "an", "the", "is", "are", "was", "were", "what", "which", "who",
    "tell", "me", "about", "describe", "explain", "show", "list", "give",
    "please", "can", "you", "i", "want", "know", "of", "for", "in", "on",
    "to", "and", "or", "with", "this", "that", "does", "do", "how", "info",
    "information", "find", "search", "query", "sparql", "generate", "write",
}

# A bare identifier/accession-shaped token (e.g. "P0C127", "GO:0003824",
# "Os01g0100200") is a much more precise search term than a random English
# word, so prefer one if the message contains it.
_ID_LIKE_PATTERN = re.compile(r"^[A-Za-z]{1,6}[:_-]?\d{2,}[A-Za-z0-9]*$")

# Without an ID-like token, only fall back to searching on "the longest
# word in the message" when one of these appears too — otherwise ordinary
# chit-chat ("hello, are you working?") ends up free-text-searched on
# whichever word happens to be longest and can spuriously match unrelated
# entity data, dragging irrelevant CBD context into the prompt.
_DOMAIN_ANCHORS = {
    "gene", "genes", "protein", "proteins", "qtl", "qtls", "pathway",
    "pathways", "ontology", "ontologies", "term", "terms", "enzyme",
    "locus", "accession", "uniprot", "trait", "traits",
}


class LlmNotConfiguredError(Exception):
    pass


def _extract_entity_uri(text: str) -> str | None:
    for match in URI_PATTERN.finditer(text):
        candidate = match.group(1).rstrip(".,;:")
        if candidate.startswith(KNOWN_ENTITY_PREFIXES):
            return candidate
    return None


def _search_candidate(text: str) -> str | None:
    """Pick a single keyword/identifier out of a chat message worth running
    a free-text entity search for."""
    tokens = re.findall(r"[A-Za-z0-9:_-]+", text)
    candidates = [t for t in tokens if len(t) >= 3 and t.lower() not in _STOPWORDS]
    if not candidates:
        return None
    id_like = [t for t in candidates if _ID_LIKE_PATTERN.match(t)]
    if id_like:
        return id_like[0]
    # No obvious ID: only search at all if the message names a domain
    # (gene/protein/QTL/...), then use the longest non-anchor word as a
    # proxy for "the most specific term in the message" (e.g.
    # "photosynthesis" out of "explain the photosynthesis pathway").
    if not any(t.lower() in _DOMAIN_ANCHORS for t in tokens):
        return None
    remaining = [t for t in candidates if t.lower() not in _DOMAIN_ANCHORS]
    if not remaining:
        return None
    return max(remaining, key=len)


def _resolve_entity_uri(message: str) -> str | None:
    """Find an AgroLD entity URI relevant to a chat message.

    First checks for a literal URI the user already pasted in. Failing
    that, runs the same free-text search the Advanced Search UI uses
    (bif:contains via core.sparql_client.keyword_search, restricted to
    gene/protein/QTL/pathway types, then ontology terms as a fallback)
    against a single significant keyword pulled out of the message, and
    takes the top-ranked hit. This is what actually makes CBD grounding
    fire for ordinary questions ("what does protein P0C127 do?") instead
    of only for messages that already contain a full AgroLD URI.
    """
    literal = _extract_entity_uri(message)
    if literal:
        return literal

    candidate = _search_candidate(message)
    if not candidate:
        return None

    try:
        from core.sparql_client import keyword_search
        from genes.dao import TYPE_URIS as GENE_TYPE_URIS
        from pathways.dao import TYPE_URIS as PATHWAY_TYPE_URIS
        from proteins.dao import TYPE_URIS as PROTEIN_TYPE_URIS
        from qtls.dao import TYPE_URIS as QTL_TYPE_URIS

        combined_types = GENE_TYPE_URIS + PROTEIN_TYPE_URIS + QTL_TYPE_URIS + PATHWAY_TYPE_URIS
        rows = keyword_search(candidate, combined_types, 0, 1)
        if rows and rows[0].get("URI"):
            return rows[0]["URI"]
    except Exception:
        logger.exception("Keyword entity search failed for %r", candidate)

    try:
        from ontologies.dao import get_ontology_terms_by_keyword

        rows = get_ontology_terms_by_keyword(candidate, 0, 1)
        if rows and rows[0].get("URI"):
            return rows[0]["URI"]
    except Exception:
        logger.exception("Ontology keyword search failed for %r", candidate)

    return None


def _format_cbd(uri: str, rows: list[dict]) -> str:
    if not rows:
        return ""
    lines = [f"Concise Bounded Description of <{uri}>:"]
    for row in rows[:CBD_MAX_TRIPLES]:
        prop = row.get("property") or "?"
        if row.get("hasValue"):
            lines.append(f"  <{uri}> {prop} {row['hasValue']} .")
        elif row.get("isValueOf"):
            lines.append(f"  {row['isValueOf']} {prop} <{uri}> .")
    return "\n".join(lines)


def _build_context(message: str) -> str:
    uri = _resolve_entity_uri(message)
    if not uri:
        return ""
    try:
        from graphs.dao import get_iri_description  # local import: avoid app-loading-order issues

        rows = get_iri_description(uri, 0, CBD_MAX_TRIPLES)
    except Exception:
        logger.exception("CBD lookup failed for %s", uri)
        return ""
    return _format_cbd(uri, rows)


def generate_reply(message: str, history: list[dict] | None = None) -> str:
    provider = settings.LLM_PROVIDER
    if provider not in ("anthropic", "openai"):
        raise LlmNotConfiguredError(
            "No LLM provider configured. Set LLM_PROVIDER=anthropic|openai and LLM_API_KEY."
        )
    context = _build_context(message)
    if provider == "anthropic":
        return _generate_anthropic(message, history or [], context)
    return _generate_openai(message, history or [], context)


def _system_prompt_with_context(context: str) -> str:
    if not context:
        return SYSTEM_PROMPT
    return f"{SYSTEM_PROMPT}\n\n{CONTEXT_INSTRUCTION}{context}"


def _generate_anthropic(message: str, history: list[dict], context: str = "") -> str:
    messages = [
        {"role": h.get("role", "user"), "content": h.get("text", "")} for h in history
    ]
    messages.append({"role": "user", "content": message})

    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": settings.LLM_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": settings.LLM_MODEL,
            "max_tokens": 1024,
            "system": _system_prompt_with_context(context),
            "messages": messages,
        },
        timeout=60,
    )
    response.raise_for_status()
    data = response.json()
    return "".join(block.get("text", "") for block in data.get("content", []))


def _generate_openai(message: str, history: list[dict], context: str = "") -> str:
    messages = [{"role": "system", "content": _system_prompt_with_context(context)}]
    messages.extend({"role": h.get("role", "user"), "content": h.get("text", "")} for h in history)
    messages.append({"role": "user", "content": message})

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {settings.LLM_API_KEY}"},
        json={"model": settings.LLM_MODEL, "messages": messages},
        timeout=60,
    )
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]

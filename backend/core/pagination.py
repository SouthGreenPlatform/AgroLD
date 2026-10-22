"""Shared page/pageSize query-param parsing, matching the legacy API's
`page` (page number, default 0) and `pageSize` (default 10) conventions."""
from __future__ import annotations

DEFAULT_PAGE = 0
DEFAULT_PAGE_SIZE = 10


def get_pagination(request) -> tuple[int, int]:
    try:
        page = int(request.query_params.get("page", DEFAULT_PAGE))
    except ValueError:
        page = DEFAULT_PAGE
    try:
        page_size = int(request.query_params.get("pageSize", DEFAULT_PAGE_SIZE))
    except ValueError:
        page_size = DEFAULT_PAGE_SIZE
    return page, page_size

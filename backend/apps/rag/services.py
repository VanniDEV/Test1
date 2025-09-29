from __future__ import annotations

import logging
from dataclasses import dataclass
from types import SimpleNamespace
from typing import Any, Dict, Iterable, List

from django.conf import settings
from django.db import transaction

from apps.content.models import Page

if settings.ENABLE_MOCKS:
    from apps.content.mocks import get_mock_page, get_mock_sections  # type: ignore F401
else:  # pragma: no cover - only used when mocks are active
    get_mock_page = get_mock_sections = None

logger = logging.getLogger(__name__)


@dataclass
class RagDraft:
    page: Any
    sections: List[Dict[str, Any]]
    metadata: Dict[str, Any]


def generate_draft(page_slug: str, prompt: str) -> RagDraft:
    if settings.ENABLE_MOCKS:
        page = get_mock_page(page_slug)
        if not page:
            raise Page.DoesNotExist
        sections = get_mock_sections(page_slug)
        sections.append({"heading": "AI Draft", "body": prompt or "Mocked RAG suggestion"})
        metadata = {
            "model": settings.RAG_MODEL_NAME,
            "provider": settings.RAG_PROVIDER,
            "mock": True,
        }
        logger.info("Generated mock draft for page %s", page_slug)
        return RagDraft(page=SimpleNamespace(slug=page_slug), sections=sections, metadata=metadata)

    page = Page.objects.get(slug=page_slug)
    sections = [
        {"heading": section.heading, "body": section.body}
        for section in page.sections.all()
    ]
    sections.append({"heading": "AI Draft", "body": prompt})
    metadata = {
        "model": settings.RAG_MODEL_NAME,
        "provider": settings.RAG_PROVIDER,
    }
    logger.info("Generated draft for page %s", page.slug)
    return RagDraft(page=page, sections=sections, metadata=metadata)


@transaction.atomic
def publish_draft(page_slug: str, updates: Iterable[Dict[str, Any]]) -> Page:
    if settings.ENABLE_MOCKS:
        logger.info("Mock mode: publishing draft for %s skipped", page_slug)
        return SimpleNamespace(slug=page_slug)

    page = Page.objects.select_for_update().get(slug=page_slug)
    existing_sections = {section.order: section for section in page.sections.all()}
    for update in updates:
        order = update.get("order", 0)
        section = existing_sections.get(order)
        if section:
            section.heading = update.get("heading", section.heading)
            section.body = update.get("body", section.body)
            section.save(update_fields=["heading", "body"])
        else:
            page.sections.create(
                heading=update.get("heading", "New Section"),
                body=update.get("body", ""),
                order=order,
            )
    logger.info("Published updates for page %s", page.slug)
    return page

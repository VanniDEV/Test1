from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List

from django.conf import settings
from django.db import transaction

from apps.content.models import Page

logger = logging.getLogger(__name__)


@dataclass
class RagDraft:
    page: Page
    sections: List[Dict[str, Any]]
    metadata: Dict[str, Any]


def generate_draft(page_slug: str, prompt: str) -> RagDraft:
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

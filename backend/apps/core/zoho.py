from __future__ import annotations

import logging
from typing import Any, Dict

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def _get_access_token() -> str:
    if not all([settings.ZOHO_CLIENT_ID, settings.ZOHO_CLIENT_SECRET, settings.ZOHO_REFRESH_TOKEN]):
        raise RuntimeError('Zoho OAuth credentials are not configured')
    response = requests.post(
        f"{settings.ZOHO_BASE_URL}/oauth/v2/token",
        params={
            "refresh_token": settings.ZOHO_REFRESH_TOKEN,
            "client_id": settings.ZOHO_CLIENT_ID,
            "client_secret": settings.ZOHO_CLIENT_SECRET,
            "grant_type": "refresh_token",
        },
        timeout=10,
    )
    response.raise_for_status()
    data = response.json()
    return data["access_token"]


def create_lead(payload: Dict[str, Any]) -> Dict[str, Any]:
    token = _get_access_token()
    headers = {"Authorization": f"Zoho-oauthtoken {token}"}
    response = requests.post(
        f"{settings.ZOHO_BASE_URL}/crm/v2/Leads",
        json={"data": [payload]},
        headers=headers,
        timeout=10,
    )
    response.raise_for_status()
    data = response.json()
    logger.info("Lead created in Zoho: %s", data)
    return data

from __future__ import annotations

from typing import Any, Dict

from django.conf import settings

from .forms import ContactForm, EbookDownloadForm, SubmissionContext
from .zoho import create_lead


def _base_payload(cleaned_data: Dict[str, Any], context: SubmissionContext) -> Dict[str, Any]:
    payload = {
        "First_Name": cleaned_data.get("first_name"),
        "Last_Name": cleaned_data.get("last_name"),
        "Email": cleaned_data.get("email"),
        "Lead_Source": "Website",
        "Owner": settings.ZOHO_LEAD_OWNER_ID or None,
    }
    if context.utm_params:
        payload.update({
            "UTM_Source": context.utm_params.get("utm_source"),
            "UTM_Medium": context.utm_params.get("utm_medium"),
            "UTM_Campaign": context.utm_params.get("utm_campaign"),
        })
    if context.referer:
        payload["Referrer"] = context.referer
    if context.ga_client_id:
        payload["GA_Client_Id"] = context.ga_client_id
    return payload


def submit_contact(data: Dict[str, Any], context: SubmissionContext) -> Dict[str, Any]:
    form = ContactForm(data)
    form.full_clean()
    if not form.is_valid():
        raise ValueError(form.errors.as_json())

    payload = _base_payload(form.cleaned_data, context)
    payload.update({
        "Company": form.cleaned_data.get("company"),
        "Description": form.cleaned_data.get("message"),
        "GDPR_Consent": "Granted" if form.cleaned_data["consent"] else "Denied",
    })
    return create_lead(payload)


def submit_ebook_download(data: Dict[str, Any], context: SubmissionContext) -> Dict[str, Any]:
    form = EbookDownloadForm(data)
    form.full_clean()
    if not form.is_valid():
        raise ValueError(form.errors.as_json())

    payload = _base_payload(form.cleaned_data, context)
    payload.update({
        "GDPR_Consent": "Granted" if form.cleaned_data["consent"] else "Denied",
        "Description": f"Requested ebook: {form.cleaned_data['ebook_slug']}",
    })
    return create_lead(payload)

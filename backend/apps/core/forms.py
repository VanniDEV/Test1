from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict

from django import forms


@dataclass
class Consent:
    text: str
    granted: bool


@dataclass
class SubmissionContext:
    utm_params: Dict[str, str] = field(default_factory=dict)
    referer: str | None = None
    ga_client_id: str | None = None


class ContactForm(forms.Form):
    first_name = forms.CharField(max_length=120)
    last_name = forms.CharField(max_length=120)
    email = forms.EmailField()
    company = forms.CharField(max_length=150, required=False)
    message = forms.CharField(widget=forms.Textarea)
    consent = forms.BooleanField()


class EbookDownloadForm(forms.Form):
    first_name = forms.CharField(max_length=120)
    last_name = forms.CharField(max_length=120)
    email = forms.EmailField()
    ebook_slug = forms.CharField(max_length=120)
    consent = forms.BooleanField()

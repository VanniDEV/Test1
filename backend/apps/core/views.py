from __future__ import annotations

import json

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from .forms import SubmissionContext
from .services import submit_contact, submit_ebook_download


def _parse_body(request) -> dict:  # noqa: ANN001 - Django request
    if request.content_type == "application/json":
        try:
            return json.loads(request.body.decode("utf-8"))
        except json.JSONDecodeError:
            return {}
    return request.POST.dict()


@method_decorator(csrf_exempt, name="dispatch")
class ContactFormView(View):
    def post(self, request, *args, **kwargs):  # noqa: ANN001, ANN002
        data = _parse_body(request)
        context = SubmissionContext(
            utm_params={key: request.GET.get(key, "") for key in request.GET if key.startswith("utm_")},
            referer=request.META.get("HTTP_REFERER"),
            ga_client_id=request.COOKIES.get("_ga"),
        )
        try:
            result = submit_contact(data, context)
        except ValueError as exc:  # pragma: no cover - serialized message for API
            return JsonResponse({"errors": str(exc)}, status=400)
        return JsonResponse(result)


@method_decorator(csrf_exempt, name="dispatch")
class EbookFormView(View):
    def post(self, request, *args, **kwargs):  # noqa: ANN001, ANN002
        data = _parse_body(request)
        context = SubmissionContext(
            utm_params={key: request.GET.get(key, "") for key in request.GET if key.startswith("utm_")},
            referer=request.META.get("HTTP_REFERER"),
            ga_client_id=request.COOKIES.get("_ga"),
        )
        try:
            result = submit_ebook_download(data, context)
        except ValueError as exc:  # pragma: no cover
            return JsonResponse({"errors": str(exc)}, status=400)
        return JsonResponse(result)

from apps.content.models import Page
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import generate_draft, publish_draft


class RagPreviewView(APIView):
    def post(self, request, *args, **kwargs):  # noqa: ANN001, ANN002
        page_slug = request.data.get("page_slug")
        if not page_slug:
            return Response({"error": "page_slug is required"}, status=status.HTTP_400_BAD_REQUEST)
        prompt = request.data.get("prompt", "")
        try:
            draft = generate_draft(page_slug, prompt)
        except Page.DoesNotExist:
            return Response({"error": "Page not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(
            {
                "page": draft.page.slug,
                "sections": draft.sections,
                "metadata": draft.metadata,
            }
        )


class RagPublishView(APIView):
    def post(self, request, *args, **kwargs):  # noqa: ANN001, ANN002
        page_slug = request.data.get("page_slug")
        if not page_slug:
            return Response({"error": "page_slug is required"}, status=status.HTTP_400_BAD_REQUEST)
        updates = request.data.get("sections", [])
        try:
            page = publish_draft(page_slug, updates)
        except Page.DoesNotExist:
            return Response({"error": "Page not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"page": page.slug}, status=status.HTTP_202_ACCEPTED)

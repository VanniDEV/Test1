from rest_framework.response import Response
from rest_framework.views import APIView


class HealthView(APIView):
    authentication_classes: list = []
    permission_classes: list = []

    def get(self, request, *args, **kwargs):  # noqa: ANN001, ANN002
        return Response({"status": "ok"})

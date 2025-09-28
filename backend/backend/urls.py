from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.content.api import BlogPostViewSet, EbookViewSet, PageViewSet, ServiceViewSet
from apps.core.api import HealthView
from apps.core.views import ContactFormView, EbookFormView
from apps.rag.api import RagPreviewView, RagPublishView

router = DefaultRouter()
router.register("pages", PageViewSet, basename="page")
router.register("services", ServiceViewSet, basename="service")
router.register("ebooks", EbookViewSet, basename="ebook")
router.register("blog-posts", BlogPostViewSet, basename="blog-post")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/health/", HealthView.as_view(), name="health"),
    path("api/forms/contact/", ContactFormView.as_view(), name="contact-form"),
    path("api/forms/ebook/", EbookFormView.as_view(), name="ebook-form"),
    path("api/rag/preview/", RagPreviewView.as_view(), name="rag-preview"),
    path("api/rag/publish/", RagPublishView.as_view(), name="rag-publish"),
]

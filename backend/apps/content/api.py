from rest_framework import mixins, viewsets

from .models import BlogPost, Ebook, Page, Service
from .serializers import BlogPostSerializer, EbookSerializer, PageSerializer, ServiceSerializer


class PageViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Page.objects.select_related("hero").prefetch_related("sections")
    serializer_class = PageSerializer
    lookup_field = "slug"


class ServiceViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    lookup_field = "slug"


class EbookViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Ebook.objects.all()
    serializer_class = EbookSerializer
    lookup_field = "slug"


class BlogPostViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = BlogPost.objects.filter(is_published=True)
    serializer_class = BlogPostSerializer
    lookup_field = "slug"

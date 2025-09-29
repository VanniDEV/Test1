from django.conf import settings
from django.http import Http404
from rest_framework import mixins, viewsets
from rest_framework.response import Response

from .models import BlogPost, Ebook, Page, Service
from .serializers import BlogPostSerializer, EbookSerializer, PageSerializer, ServiceSerializer

if settings.ENABLE_MOCKS:
    from .mocks import (
        get_mock_blog_post,
        get_mock_blog_posts,
        get_mock_ebook,
        get_mock_ebooks,
        get_mock_page,
        get_mock_service,
        get_mock_services,
    )


class PageViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Page.objects.select_related("hero").prefetch_related("sections")
    serializer_class = PageSerializer
    lookup_field = "slug"

    def retrieve(self, request, *args, **kwargs):  # noqa: ANN001, ANN002
        if settings.ENABLE_MOCKS:
            slug = kwargs.get(self.lookup_field)
            page = get_mock_page(slug) if slug else None
            if not page:
                raise Http404
            return Response(page)
        return super().retrieve(request, *args, **kwargs)


class ServiceViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    lookup_field = "slug"

    def list(self, request, *args, **kwargs):  # noqa: ANN001, ANN002
        if settings.ENABLE_MOCKS:
            return Response(get_mock_services())
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):  # noqa: ANN001, ANN002
        if settings.ENABLE_MOCKS:
            slug = kwargs.get(self.lookup_field)
            service = get_mock_service(slug) if slug else None
            if not service:
                raise Http404
            return Response(service)
        return super().retrieve(request, *args, **kwargs)


class EbookViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Ebook.objects.all()
    serializer_class = EbookSerializer
    lookup_field = "slug"

    def list(self, request, *args, **kwargs):  # noqa: ANN001, ANN002
        if settings.ENABLE_MOCKS:
            return Response(get_mock_ebooks())
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):  # noqa: ANN001, ANN002
        if settings.ENABLE_MOCKS:
            slug = kwargs.get(self.lookup_field)
            ebook = get_mock_ebook(slug) if slug else None
            if not ebook:
                raise Http404
            return Response(ebook)
        return super().retrieve(request, *args, **kwargs)


class BlogPostViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = BlogPost.objects.filter(is_published=True)
    serializer_class = BlogPostSerializer
    lookup_field = "slug"

    def list(self, request, *args, **kwargs):  # noqa: ANN001, ANN002
        if settings.ENABLE_MOCKS:
            return Response(get_mock_blog_posts())
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):  # noqa: ANN001, ANN002
        if settings.ENABLE_MOCKS:
            slug = kwargs.get(self.lookup_field)
            post = get_mock_blog_post(slug) if slug else None
            if not post:
                raise Http404
            return Response(post)
        return super().retrieve(request, *args, **kwargs)

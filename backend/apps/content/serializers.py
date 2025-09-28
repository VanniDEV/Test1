from rest_framework import serializers

from .models import BlogPost, Ebook, Hero, Page, PageSection, Service


class HeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero
        fields = ("title", "subtitle", "cta_label", "cta_url")


class PageSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageSection
        fields = ("heading", "body", "order")


class PageSerializer(serializers.ModelSerializer):
    hero = HeroSerializer()
    sections = PageSectionSerializer(many=True)

    class Meta:
        model = Page
        fields = (
            "slug",
            "hero",
            "seo_title",
            "seo_description",
            "schema_markup",
            "sections",
        )


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ("name", "slug", "description", "long_description")


class EbookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ebook
        fields = ("title", "slug", "summary", "file")


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = (
            "title",
            "slug",
            "excerpt",
            "content",
            "published_at",
        )

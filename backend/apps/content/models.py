from __future__ import annotations

from django.db import models
from django.utils import timezone


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Hero(TimeStampedModel):
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True)
    cta_label = models.CharField(max_length=100, blank=True)
    cta_url = models.URLField(blank=True)

    def __str__(self) -> str:
        return self.title


class Service(TimeStampedModel):
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    long_description = models.TextField(blank=True)

    def __str__(self) -> str:
        return self.name


class Ebook(TimeStampedModel):
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    summary = models.TextField()
    file = models.FileField(upload_to="ebooks/")

    def __str__(self) -> str:
        return self.title


class BlogPost(TimeStampedModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField()
    content = models.TextField()
    published_at = models.DateTimeField(default=timezone.now)
    is_published = models.BooleanField(default=False)

    class Meta:
        ordering = ["-published_at"]

    def __str__(self) -> str:
        return self.title


class Page(TimeStampedModel):
    HOME = "home"
    SERVICES = "services"
    EBOOKS = "ebooks"
    BLOG = "blog"

    PAGE_CHOICES = [
        (HOME, "Home"),
        (SERVICES, "Services"),
        (EBOOKS, "Ebooks"),
        (BLOG, "Blog"),
    ]

    slug = models.CharField(max_length=50, choices=PAGE_CHOICES, unique=True)
    hero = models.OneToOneField(Hero, on_delete=models.SET_NULL, null=True, blank=True)
    seo_title = models.CharField(max_length=180, blank=True)
    seo_description = models.CharField(max_length=300, blank=True)
    schema_markup = models.JSONField(blank=True, default=dict)

    def __str__(self) -> str:
        return self.get_slug_display()


class PageSection(TimeStampedModel):
    page = models.ForeignKey(Page, related_name="sections", on_delete=models.CASCADE)
    heading = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.page.slug} - {self.heading}"

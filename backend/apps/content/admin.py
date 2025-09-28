from django.contrib import admin

from . import models


class PageSectionInline(admin.TabularInline):
    model = models.PageSection
    extra = 1


@admin.register(models.Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("slug", "updated_at")
    inlines = [PageSectionInline]


@admin.register(models.Hero)
class HeroAdmin(admin.ModelAdmin):
    list_display = ("title", "updated_at")


@admin.register(models.Service)
class ServiceAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ("name", "updated_at")


@admin.register(models.Ebook)
class EbookAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ("title", "updated_at")


@admin.register(models.BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "is_published", "published_at")
    list_filter = ("is_published",)
    search_fields = ("title", "excerpt")
    prepopulated_fields = {"slug": ("title",)}

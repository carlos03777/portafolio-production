from django.contrib import admin
from django.utils.html import format_html

from .models import (
    ContactMessage,
    Profile,
    Project,
    ProjectImage,
    Technology,
)


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ("image", "caption")
    show_change_link = True


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "is_published", "order", "created_at")
    list_filter = ("is_published", "technologies", "created_at")
    search_fields = ("title", "excerpt", "description")
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ("technologies",)
    inlines = (ProjectImageInline,)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        (
            "Información básica",
            {
                "fields": (
                    "title",
                    "slug",
                    "excerpt",
                    "description",
                    "is_published",
                    "order",
                )
            },
        ),
        (
            "Multimedia",
            {"fields": ("featured_image", "video_url")},
        ),
        (
            "Enlaces",
            {"fields": ("repo_url", "live_url")},
        ),
        (
            "Tecnologías",
            {"fields": ("technologies",)},
        ),
        (
            "Fechas",
            {"fields": ("created_at", "updated_at")},
        ),
    )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "title", "is_active", "photo_preview")
    list_filter = ("is_active",)
    search_fields = ("name", "title", "description")
    readonly_fields = ("photo_preview",)

    fieldsets = (
        (
            "Información general",
            {
                "fields": (
                    "name",
                    "title",
                    "description",
                    "photo",
                    "photo_preview",
                )
            },
        ),
        (
            "Contacto y redes",
            {
                "fields": (
                    "email",
                    "location",
                    "github",
                    "linkedin",
                    "behance",
                    "instagram",
                    "website",
                )
            },
        ),
        (
            "CV y estado",
            {"fields": ("cv_file", "is_active")},
        ),
    )

    @admin.display(description="Vista previa")
    def photo_preview(self, obj):
        if not obj or not obj.photo:
            return "—"

        return format_html(
            '<img src="{}" alt="Foto de {}" '
            'style="width: 80px; height: 80px; object-fit: cover; '
            'border-radius: 50%;" />',
            obj.photo.url,
            obj.name,
        )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at")
    search_fields = ("name", "email", "message")
    readonly_fields = ("name", "email", "message", "created_at")
    ordering = ("-created_at",)

    def has_add_permission(self, request):
        # Los mensajes deben llegar desde el formulario del sitio.
        return False

    def has_change_permission(self, request, obj=None):
        # Permite consultar los mensajes, pero no modificarlos.
        return (
            super().has_change_permission(request, obj)
            and obj is None
        )
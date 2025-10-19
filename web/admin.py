
from django.contrib import admin
from .models import Project, Technology, ProjectImage,ContactMessage


# -----------------------------
# TECHNOLOGY ADMIN
# -----------------------------
@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ("name",)
    search_fields = ("name",)


# -----------------------------
# INLINE IMAGES FOR PROJECT
# -----------------------------
class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ("image", "caption")
    readonly_fields = ()
    show_change_link = True


# -----------------------------
# PROJECT ADMIN
# -----------------------------
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "is_published", "order", "created_at")
    list_filter = ("is_published", "technologies", "created_at")
    search_fields = ("title", "excerpt", "description")
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ("technologies",)
    inlines = [ProjectImageInline]

    fieldsets = (
        ("Información básica", {
            "fields": ("title", "slug", "excerpt", "description", "is_published", "order")
        }),
        ("Multimedia", {
            "fields": ("featured_image", "video_url"),
        }),
        ("Enlaces", {
            "fields": ("repo_url", "live_url"),
        }),
        ("Tecnologías", {
            "fields": ("technologies",),
        }),
        ("Fechas", {
            "fields": ("created_at", "updated_at"),
        }),
    )

    readonly_fields = ("created_at", "updated_at")

# -----------------------------
# PROFILE
# -----------------------------

from django.contrib import admin
from django.utils.html import format_html
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'is_active', 'photo_preview')
    list_filter = ('is_active',)
    search_fields = ('name', 'title', 'description')
    readonly_fields = ('photo_preview',)

    fieldsets = (
        ('Información general', {
            'fields': ('name', 'title', 'description', 'photo', 'photo_preview')
        }),
        ('Contacto y redes', {
            'fields': ('email', 'location', 'github', 'linkedin', 'behance', 'instagram', 'website')
        }),
        ('CV y estado', {
            'fields': ('cv_file', 'is_active')
        }),
    )

    def photo_preview(self, obj):
        """Muestra una miniatura de la foto en el admin."""
        if obj.photo:
            return format_html('<img src="{}" style="width:80px; height:80px; border-radius:50%;" />', obj.photo.url)
        return "—"
    photo_preview.short_description = "Vista previa"

    def save_model(self, request, obj, form, change):
        """
        Asegura que solo un perfil quede activo.
        """
        if obj.is_active:
            Profile.objects.exclude(pk=obj.pk).update(is_active=False)
        super().save_model(request, obj, form, change)


# -----------------------------
# Contact
# -----------------------------

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)

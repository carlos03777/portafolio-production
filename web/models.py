from django.core.validators import FileExtensionValidator
from django.db import models, transaction
from django.db.models import Q
from django.utils.text import slugify


def make_unique_slug(instance, value, max_length, fallback):
    """Genera un slug único a partir de un texto."""

    base_slug = slugify(value)[:max_length].strip("-") or fallback
    slug = base_slug
    suffix_number = 2

    queryset = instance.__class__.objects.all()
    if instance.pk:
        queryset = queryset.exclude(pk=instance.pk)

    while queryset.filter(slug=slug).exists():
        suffix = f"-{suffix_number}"
        slug = f"{base_slug[:max_length - len(suffix)]}{suffix}"
        suffix_number += 1

    return slug


class Technology(models.Model):
    name = models.CharField("nombre", max_length=50)
    slug = models.SlugField(
        "slug",
        max_length=60,
        unique=True,
        blank=True,
    )

    class Meta:
        ordering = ["name"]
        verbose_name = "tecnología"
        verbose_name_plural = "tecnologías"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = make_unique_slug(
                self,
                self.name,
                max_length=60,
                fallback="tecnologia",
            )
        super().save(*args, **kwargs)

class Project(models.Model):
    class Category(models.TextChoices):
        WEB_DEVELOPMENT = "web_development", "Desarrollo web"
        VISUAL_IDENTITY = "visual_identity", "Identidad visual"
        GRAPHIC_EDITORIAL = "graphic_editorial", "Diseño gráfico y editorial"
        MULTIMEDIA = "multimedia", "Multimedia e ilustración"
        DIGITAL_ART = "digital_art", "Wallpapers y arte digital"
        FINAL_ARTWORK = "final_artwork", "Arte final"
        OTHER = "other", "Otro / por clasificar"

    title = models.CharField("título", max_length=200)
    slug = models.SlugField(
        "slug",
        max_length=220,
        unique=True,
        blank=True,
    )
    category = models.CharField(
        "categoría",
        max_length=30,
        choices=Category.choices,
        default=Category.OTHER,
    )
    excerpt = models.CharField(
        "resumen",
        max_length=300,
        blank=True,
    )
    description = models.TextField(
        "descripción",
        blank=True,
    )
    client = models.CharField(
        "cliente o marca",
        max_length=150,
        blank=True,
        help_text="Déjalo vacío si es un proyecto personal.",
    )
    role = models.CharField(
        "rol en el proyecto",
        max_length=150,
        blank=True,
        help_text="Por ejemplo: diseño, desarrollo o dirección de arte.",
    )
    year = models.PositiveSmallIntegerField(
        "año",
        blank=True,
        null=True,
    )
    featured_image = models.ImageField(
        "imagen principal",
        upload_to="projects/",
        blank=True,
        null=True,
        help_text="Imagen de portada para las tarjetas y el detalle.",
    )
    video_url = models.URLField(
        "URL del video",
        blank=True,
        null=True,
        help_text="URL del video (YouTube, Vimeo, etc.).",
    )
    repo_url = models.URLField(
        "URL del repositorio",
        blank=True,
        null=True,
    )
    live_url = models.URLField(
        "URL del proyecto publicado",
        blank=True,
        null=True,
    )
    technologies = models.ManyToManyField(
        Technology,
        verbose_name="tecnologías y herramientas",
        blank=True,
        related_name="projects",
    )
    is_published = models.BooleanField(
        "publicado",
        default=True,
    )
    is_featured = models.BooleanField(
        "destacado en Inicio",
        default=False,
        help_text="Actívalo para mostrar este proyecto en la página de inicio.",
    )
    order = models.IntegerField(
        "orden",
        default=0,
    )
    created_at = models.DateTimeField(
        "fecha de creación",
        auto_now_add=True,
    )
    updated_at = models.DateTimeField(
        "fecha de actualización",
        auto_now=True,
    )

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name = "proyecto"
        verbose_name_plural = "proyectos"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = make_unique_slug(
                self,
                self.title,
                max_length=220,
                fallback="proyecto",
            )
        super().save(*args, **kwargs)


class ProjectImage(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name="proyecto",
    )
    image = models.ImageField(
        "imagen",
        upload_to="projects/gallery/",
    )
    caption = models.CharField(
        "descripción visible",
        max_length=150,
        blank=True,
    )
    alt_text = models.CharField(
        "texto alternativo",
        max_length=180,
        blank=True,
        help_text="Describe la imagen para quienes usan lectores de pantalla.",
    )
    order = models.PositiveIntegerField(
        "orden",
        default=0,
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "imagen del proyecto"
        verbose_name_plural = "imágenes del proyecto"

    def __str__(self):
        return f"Imagen de {self.project.title}"

class Profile(models.Model):
    """Perfil personal del portafolio."""

    name = models.CharField(
        "nombre",
        max_length=100,
        help_text="Tu nombre completo o profesional.",
    )
    title = models.CharField(
        "título profesional",
        max_length=150,
        help_text="Ejemplo: Desarrollador web / Diseñador multimedia.",
    )
    description = models.TextField(
        "descripción",
        help_text="Una breve descripción sobre ti, tu experiencia o enfoque.",
    )
    photo = models.ImageField(
        "foto",
        upload_to="profile/",
        blank=True,
        null=True,
        help_text="Foto de perfil o retrato profesional.",
    )

    github = models.URLField("GitHub", blank=True, null=True)
    linkedin = models.URLField("LinkedIn", blank=True, null=True)
    behance = models.URLField("Behance", blank=True, null=True)
    instagram = models.URLField("Instagram", blank=True, null=True)
    website = models.URLField("sitio web", blank=True, null=True)

    cv_file = models.FileField(
        "hoja de vida",
        upload_to="profile/cv/",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(["pdf"])],
        help_text="Archivo PDF con tu hoja de vida.",
    )

    location = models.CharField(
        "ubicación",
        max_length=120,
        blank=True,
        null=True,
    )
    email = models.EmailField(
        "correo electrónico",
        blank=True,
        null=True,
    )

    is_active = models.BooleanField(
        "perfil activo",
        default=True,
        help_text="Solo un perfil debe estar activo.",
    )

    class Meta:
        ordering = ["name"]
        verbose_name = "perfil"
        verbose_name_plural = "perfil"
        constraints = [
            models.UniqueConstraint(
                fields=["is_active"],
                condition=Q(is_active=True),
                name="only_one_active_profile",
            ),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.is_active:
            with transaction.atomic():
                Profile.objects.exclude(pk=self.pk).update(is_active=False)
                super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)


class ContactMessage(models.Model):
    name = models.CharField("nombre", max_length=100)
    email = models.EmailField("correo electrónico")
    message = models.TextField("mensaje")
    created_at = models.DateTimeField(
        "fecha de envío",
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "mensaje de contacto"
        verbose_name_plural = "mensajes de contacto"

    def __str__(self):
        return f"{self.name} - {self.email}"
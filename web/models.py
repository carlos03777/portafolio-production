from django.db import models
from django.utils.text import slugify





class Technology(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=60, unique=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    excerpt = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    featured_image = models.ImageField(
        upload_to='projects/', blank=True, null=True,
        help_text="Imagen principal del proyecto"
    )
    video_url = models.URLField(
        blank=True, null=True,
        help_text="URL del video (YouTube, Vimeo, etc.)"
    )
    repo_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    technologies = models.ManyToManyField(Technology, blank=True)
    is_published = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)[:200]
            self.slug = base
        super().save(*args, **kwargs)


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='projects/gallery/')
    caption = models.CharField(max_length=150, blank=True)

    class Meta:
        verbose_name = "Project Image"
        verbose_name_plural = "Project Images"
        ordering = ['id']

    def __str__(self):
        return f"Imagen de {self.project.title}"


from django.db import models


class Profile(models.Model):
    """Perfil personal único para el portafolio."""

    # Información básica
    name = models.CharField(max_length=100, help_text="Tu nombre completo o profesional")
    title = models.CharField(max_length=150, help_text="Ejemplo: Desarrollador Web / Diseñador Multimedia")
    description = models.TextField(
        help_text="Una breve descripción sobre ti, tu experiencia o enfoque profesional"
    )
    photo = models.ImageField(
        upload_to='profile/',
        blank=True,
        null=True,
        help_text="Foto de perfil o retrato profesional"
    )

    # Redes sociales
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    behance = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    # CV
    cv_file = models.FileField(
        upload_to='profile/cv/',
        blank=True,
        null=True,
        help_text="Archivo PDF con tu hoja de vida"
    )

    # Otros
    location = models.CharField(max_length=120, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    # Control
    is_active = models.BooleanField(default=True, help_text="Solo un perfil debe estar activo")

    class Meta:
        verbose_name = "Perfil"
        verbose_name_plural = "Perfil"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """
        Asegura que solo haya un perfil activo (tú).
        Si se activa uno, desactiva los demás automáticamente.
        """
        if self.is_active:
            Profile.objects.exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)

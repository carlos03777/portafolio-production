from django.contrib import messages
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse

from .models import ContactMessage, Profile, Project


def get_active_profile():
    """Devuelve el perfil activo, si existe."""
    return Profile.objects.filter(is_active=True).first()


def home(request):
    """Muestra el portafolio y procesa el formulario de contacto."""

    if request.method == "POST":
        name = (request.POST.get("name") or "").strip()
        email = (request.POST.get("email") or "").strip()
        message = (request.POST.get("message") or "").strip()

        if not name or not email or not message:
            messages.error(
                request,
                "Completa todos los campos antes de enviar el mensaje.",
            )
        elif len(name) > 100:
            messages.error(
                request,
                "El nombre no puede superar los 100 caracteres.",
            )
        elif len(email) > 254:
            messages.error(
                request,
                "El correo electrónico es demasiado largo.",
            )
        else:
            try:
                validate_email(email)
            except ValidationError:
                messages.error(
                    request,
                    "Escribe un correo electrónico válido.",
                )
            else:
                ContactMessage.objects.create(
                    name=name,
                    email=email,
                    message=message,
                )
                messages.success(
                    request,
                    "Tu mensaje se envió correctamente.",
                )

        return redirect(f"{reverse('web:home')}#contact")

    profile = get_active_profile()
    published_projects = (
        Project.objects.filter(is_published=True)
        .prefetch_related("technologies")
    )

    featured_projects = (
        published_projects.filter(is_featured=True)
        .order_by("order", "-created_at")
    )

    # Si todavía no se han marcado proyectos como destacados,
    # muestra hasta tres proyectos publicados mientras se configura el portafolio.
    if not featured_projects.exists():
        featured_projects = published_projects.order_by(
            "order",
            "-created_at",
        )[:3]

    return render(
        request,
        "web/index.html",
        {
            "profile": profile,
            "projects": featured_projects,
        },
    )


def project_list(request):
    """Muestra el catálogo de proyectos con filtro por categoría."""

    profile = get_active_profile()
    selected_category = (request.GET.get("category") or "").strip()

    valid_categories = {
        value for value, _label in Project.Category.choices
    }

    projects = (
        Project.objects.filter(is_published=True)
        .prefetch_related("technologies")
        .order_by("order", "-created_at")
    )

    if selected_category in valid_categories:
        projects = projects.filter(category=selected_category)
    else:
        selected_category = ""

    return render(
        request,
        "web/project_list.html",
        {
            "profile": profile,
            "projects": projects,
            "categories": Project.Category.choices,
            "selected_category": selected_category,
        },
    )


def project_detail(request, slug):
    """Muestra el detalle de un proyecto publicado."""

    profile = get_active_profile()
    project = get_object_or_404(
        Project.objects.prefetch_related("images", "technologies"),
        slug=slug,
        is_published=True,
    )

    return render(
        request,
        "web/project_detail.html",
        {
            "profile": profile,
            "project": project,
            "images": project.images.all(),
        },
    )


def about(request):
    """Muestra la información del perfil activo."""

    profile = get_active_profile()

    return render(
        request,
        "web/about_detail.html",
        {"profile": profile},
    )


def under_construction(request):
    """Muestra la página de contenido en construcción."""

    return render(
        request,
        "under_construction.html",
        {"profile": get_active_profile()},
    )
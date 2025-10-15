# web/views.py
from django.shortcuts import render, get_object_or_404
from .models import Project

# =============================
# HOME PAGE
# =============================
def home(request):
    """
    Página principal del portafolio.
    - Muestra los proyectos publicados.
    - Carga la información del perfil activo.
    """
    # Obtener perfil activo (solo uno gracias al método save del modelo)
    profile = Profile.objects.filter(is_active=True).first()

    # Obtener proyectos publicados y ordenados
    projects = Project.objects.filter(is_published=True).order_by('order', '-created_at')

    # Renderizar plantilla con contexto
    return render(request, "web/index.html", {
        "profile": profile,
        "projects": projects,
    })


# =============================
# PROJECT DETAIL
# =============================
def project_detail(request, slug):
    """Detalle de un proyecto individual."""
    project = get_object_or_404(Project, slug=slug)
    images = project.images.all()  # relación inversa con imágenes
    return render(request, "web/project_detail.html", {
        "project": project,
        "images": images
    })


# =============================
# ABOUT DETAIL
# =============================
# def about_detail(request):
#     """Sección 'Sobre mí'."""
#     return render(request, "web/about_detail.html")


# views.py
from django.shortcuts import render
from .models import Profile

def about(request):
    profile = Profile.objects.filter(is_active=True).first()
    return render(request, 'web/about_detail.html', {'profile': profile})


# =============================
# UNDER CONSTRUCTION
# =============================
def under_construction(request):
    return render(request, 'under_construction.html')


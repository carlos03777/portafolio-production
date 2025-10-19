# web/views.py
from django.shortcuts import render, get_object_or_404
from .models import Project, ContactMessage
from django.contrib import messages


# =============================
# HOME PAGE
# =============================
from django.shortcuts import render
from django.contrib import messages
from .models import Profile, Project, ContactMessage  # 👈 asegúrate de tener el modelo de contacto

def home(request):
    """
    Página principal del portafolio.
    - Muestra los proyectos publicados.
    - Carga la información del perfil activo.
    - Procesa el formulario de contacto.
    """
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("message")

        if name and email and message:
            ContactMessage.objects.create(
                name=name,
                email=email,
                message=message
            )
            messages.success(request, "✅ ¡Tu mensaje ha sido enviado con éxito!")
            return redirect('web:home')  # ← importante: evita reenvíos y mantiene el mensaje
        else:
            messages.error(request, "❌ Por favor completa todos los campos antes de enviar.")
            return redirect('web:home')

    # Datos del perfil y proyectos (solo para GET)
    profile = Profile.objects.filter(is_active=True).first()
    projects = Project.objects.filter(is_published=True).order_by("order", "-created_at")

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

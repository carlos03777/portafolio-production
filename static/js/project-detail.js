(() => {
  "use strict";

  const gallery = document.querySelector("[data-project-gallery]");

  // Si el proyecto no tiene galería, no hay nada que inicializar.
  if (!gallery) return;

  const mainImage = gallery.querySelector("[data-gallery-main]");
  const caption = gallery.querySelector("[data-gallery-caption]");
  const thumbnails = Array.from(
    gallery.querySelectorAll("[data-gallery-thumb]")
  );
  const previousButton = gallery.querySelector("[data-gallery-prev]");
  const nextButton = gallery.querySelector("[data-gallery-next]");

  if (!mainImage || thumbnails.length === 0) return;

  let activeIndex = thumbnails.findIndex(
    (thumbnail) => thumbnail.getAttribute("aria-current") === "true"
  );

  if (activeIndex < 0) activeIndex = 0;

  function showImage(index) {
    // Mantiene la navegación dentro de los límites de la galería.
    activeIndex = (index + thumbnails.length) % thumbnails.length;

    const thumbnail = thumbnails[activeIndex];
    const imageSrc = thumbnail.dataset.imageSrc;
    const imageAlt = thumbnail.dataset.imageAlt || "";
    const imageCaption = thumbnail.dataset.imageCaption || "";

    if (!imageSrc) return;

    // Evita mantener el zoom centrado en la imagen que se acaba de reemplazar.
    mainImage.style.transformOrigin = "center";
    mainImage.src = imageSrc;
    mainImage.alt = imageAlt;

    if (caption) {
      caption.textContent = imageCaption;
    }

    thumbnails.forEach((item, itemIndex) => {
      const isActive = itemIndex === activeIndex;

      item.classList.toggle("is-active", isActive);

      if (isActive) {
        item.setAttribute("aria-current", "true");
      } else {
        item.removeAttribute("aria-current");
      }
    });

    thumbnail.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => showImage(index));
  });

  previousButton?.addEventListener("click", () => {
    showImage(activeIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    showImage(activeIndex + 1);
  });

  // Navegación por teclado cuando el foco está dentro de la galería.
  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showImage(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showImage(activeIndex + 1);
    }
  });

  // Alinea la imagen principal con la miniatura que ya aparece activa en el HTML.
  showImage(activeIndex);
})();
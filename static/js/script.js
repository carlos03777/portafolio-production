"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const body = document.body;

  /* =====================================================
     SUBRAYADO ANIMADO DE LOS ENLACES
     ===================================================== */

  const svgVariants = [
    `<svg viewBox="0 0 310 40" aria-hidden="true">
      <path d="M5 21C26.8 16.2 49.6 11.6 71.8 14.7C85 16.5 97 21.8 110 24.4C116.4 25.65 123 25.51 129 22.64C136 19.33 142.6 15.14 150 13.33C157 11.72 162 14.62 168 16.83C182 21.72 195 22.62 209 21.39C225 20.05 240 17.99 255 18.31C272 18.64 288 18.87 305 18"
        stroke="currentColor" stroke-width="8" stroke-linecap="round" fill="none"/>
    </svg>`,
    `<svg viewBox="0 0 310 40" aria-hidden="true">
      <path d="M5 25C26.2 20.3 47.7 17 69.1 13.84C98 9.6 128.4 4.02 158 5.15C172.6 5.7 187.7 8.66 201.6 11.97C207.2 13.3 215.4 14.94 220.1 18.36C224.4 21.46 220.7 25.66 217.2 27.62C208.3 32.51 197.2 34.28 186.7 34.85C183.2 35.04 147.2 36.26 155.1 26.58C158.1 22.9 163 20.62 167.8 18.79C178.4 14.72 190.1 12.11 201.6 10.4C218.4 7.9 235.5 7.06 252.5 7.49C258.5 7.64 264.4 7.93 270.3 8.42C280.3 9.25 296 10.9 305 13"
        stroke="currentColor" stroke-width="8" stroke-linecap="round" fill="none"/>
    </svg>`,
    `<svg viewBox="0 0 310 40" aria-hidden="true">
      <path d="M5 30C53 27 99 22 146 17C152 16.7 157 16 162 15.65C163 15.6 165 15.4 164 16.43C162 20.36 157 23.76 154 27.5C153 28.37 148 33.47 151 34.66C154 36.08 164 32.6 165 32.2C179 28.36 191 23.6 205 19.54C232 11.34 259 5.83 289 5.12"
        stroke="currentColor" stroke-width="8" stroke-linecap="round" fill="none"/>
    </svg>`,
  ];

  const drawLinks = document.querySelectorAll("[data-draw-line]");
  let underlineIndex = Math.floor(Math.random() * svgVariants.length);

  drawLinks.forEach((link) => {
    const box = link.querySelector("[data-draw-line-box]");
    if (!box) return;

    let activeTween = null;
    let leaveTween = null;

    function clearTweens() {
      activeTween?.kill();
      leaveTween?.kill();
      activeTween = null;
      leaveTween = null;
    }

    function drawUnderline() {
      clearTweens();
      box.replaceChildren();

      const wrapper = document.createElement("div");
      wrapper.innerHTML = svgVariants[underlineIndex].trim();

      const svg = wrapper.firstElementChild;
      const path = svg?.querySelector("path");

      if (!svg || !path) return;

      svg.classList.add("text-draw__box-svg");
      svg.setAttribute("preserveAspectRatio", "none");
      box.appendChild(svg);

      underlineIndex = (underlineIndex + 1) % svgVariants.length;

      if (typeof window.gsap === "undefined") {
        path.style.strokeDasharray = "none";
        path.style.strokeDashoffset = "0";
        return;
      }

      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      activeTween = window.gsap.to(path, {
        strokeDashoffset: 0,
        duration: prefersReducedMotion ? 0 : 0.55,
        ease: "power2.inOut",
        onComplete: () => {
          activeTween = null;
        },
      });
    }

    function eraseUnderline() {
      const path = box.querySelector("path");

      if (!path) {
        box.replaceChildren();
        return;
      }

      if (typeof window.gsap === "undefined" || prefersReducedMotion) {
        clearTweens();
        box.replaceChildren();
        return;
      }

      const length = path.getTotalLength();
      clearTweens();

      leaveTween = window.gsap.to(path, {
        strokeDashoffset: -length,
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: () => {
          box.replaceChildren();
          leaveTween = null;
        },
      });
    }

    link.addEventListener("pointerenter", drawUnderline);
    link.addEventListener("pointerleave", eraseUnderline);
    link.addEventListener("focus", drawUnderline);
    link.addEventListener("blur", eraseUnderline);
  });

  /* =====================================================
     NAVBAR
     ===================================================== */

  const navbar = document.querySelector(".navbar");

  function updateNavbarOnScroll() {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }

  updateNavbarOnScroll();
  window.addEventListener("scroll", updateNavbarOnScroll, { passive: true });

  /* =====================================================
     MODO CLARO / OSCURO
     ===================================================== */

  const themeToggle = document.getElementById("theme-toggle");

  function readSavedTheme() {
    try {
      return window.localStorage.getItem("theme");
    } catch {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      window.localStorage.setItem("theme", theme);
    } catch {
      // El tema funciona aunque el navegador bloquee localStorage.
    }
  }

  function updateThemeButton() {
    if (!themeToggle) return;

    const isDark = body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
    );
  }

  if (readSavedTheme() === "dark") {
    body.classList.add("dark");
  }

  updateThemeButton();

  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark");

    const theme = body.classList.contains("dark") ? "dark" : "light";
    saveTheme(theme);
    updateThemeButton();
  });

  /* =====================================================
     MENÚ MÓVIL
     ===================================================== */

  const menuToggle = document.querySelector(".navbar-toggle");
  const navbarLinks = document.querySelector(".navbar-links");

  function setMenuOpen(isOpen) {
    if (!menuToggle || !navbarLinks) return;

    navbarLinks.classList.toggle("active", isOpen);
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú"
    );
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  navbarLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("click", (event) => {
    if (!menuToggle || !navbarLinks) return;

    const clickedInsideMenu =
      navbarLinks.contains(event.target) || menuToggle.contains(event.target);

    if (!clickedInsideMenu) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  /* =====================================================
     HERO: ROTACIÓN DE PALABRAS E IMAGEN
     ===================================================== */

  const previousWord = document.querySelector(".hero-word_prev");
  const currentWord = document.querySelector(".hero-word_current");
  const nextWord = document.querySelector(".hero-word_next");
  const heroImage = document.querySelector(".hero-img");

  if (previousWord && currentWord && nextWord) {
    const words = ["solve.", "design.", "build.", "write.", "create."];
    let index = Math.max(0, words.indexOf(currentWord.textContent.trim()));

    function rotateWords() {
      previousWord.textContent =
        words[(index - 1 + words.length) % words.length];
      currentWord.textContent = words[index];
      nextWord.textContent = words[(index + 1) % words.length];

      index = (index + 1) % words.length;
    }

    rotateWords();

    if (!prefersReducedMotion) {
      window.setInterval(rotateWords, 2500);
    }
  }

  if (
    heroImage &&
    !prefersReducedMotion &&
    typeof window.gsap !== "undefined"
  ) {
    window.gsap.from(heroImage, {
      x: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
    });
  }

  /* =====================================================
     ABOUT: TARJETA 3D
     ===================================================== */

  const card = document.querySelector("#about .card3d");

  if (card) {
    const glare = card.querySelector(".glare");
    const minimap = document.querySelector("#about .minimap");
    const minimapValues = minimap ? minimap.querySelectorAll("span") : [];
    const logos = card.querySelectorAll(".logo");
    const flipButtons = card.querySelectorAll(".flip-btn");

    // Permite que la inclinación siga suavemente al cursor.
    card.style.transition = "transform 0.15s ease-out";

    function setFlipped(isFlipped) {
      card.dataset.active = String(isFlipped);

      flipButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(isFlipped));
      });
    }

    flipButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        setFlipped(card.dataset.active !== "true");
      });
    });

    card.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;

      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      if (centerX > 0 && centerY > 0) {
        const rotateX = ((y - centerY) / centerY) * 15;
        const rotateY = ((x - centerX) / centerX) * 15;

        // Inclinación original de la tarjeta al mover el cursor.
        card.style.transform =
          `rotateY(${rotateY}deg) rotateX(${-rotateX}deg)`;
      }

      if (minimapValues.length >= 2) {
        minimapValues[0].textContent = `x: ${Math.round(x)}`;
        minimapValues[1].textContent = `y: ${Math.round(y)}`;
      }

      if (glare) {
        glare.style.background = `radial-gradient(
          circle at ${x}px ${y}px,
          rgba(255, 255, 255, 0.4),
          transparent 60%
        )`;
      }

      logos.forEach((logo) => {
        const logoBounds = logo.getBoundingClientRect();
        const logoX = logoBounds.left + logoBounds.width / 2;
        const logoY = logoBounds.top + logoBounds.height / 2;
        const dx = event.clientX - logoX;
        const dy = event.clientY - logoY;
        const distance = Math.hypot(dx, dy);
        const hue = ((Math.atan2(dy, dx) + Math.PI) / (2 * Math.PI)) * 360;
        const intensity = Math.max(0.1, 1 - distance / 300);

        logo.style.setProperty("--hue", `${hue}deg`);
        logo.style.setProperty("--angle", `${(Date.now() / 10) % 360}deg`);
        logo.style.opacity = String(intensity);
        logo.classList.toggle("prism", intensity > 0.2);

        const icon = logo.querySelector(".logo-icon");
        if (icon) {
          icon.style.filter =
            `hue-rotate(${hue}deg) brightness(${1.2 + intensity}) saturate(2)`;
        }
      });
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "rotateY(0deg) rotateX(0deg)";

      if (glare) {
        glare.style.background =
          "radial-gradient(circle, rgba(255,255,255,0.2), transparent 60%)";
      }

      logos.forEach((logo) => {
        logo.style.setProperty("--hue", "0deg");
        logo.style.setProperty("--angle", "0deg");
        logo.style.opacity = "";
        logo.classList.remove("prism");

        const icon = logo.querySelector(".logo-icon");
        if (icon) icon.style.filter = "";
      });

      if (minimapValues.length >= 2) {
        minimapValues[0].textContent = "x: 0";
        minimapValues[1].textContent = "y: 0";
      }
    });
  }

  /* =====================================================
     HABILIDADES: LOGOS DEL FONDO Y CATEGORÍAS
     ===================================================== */

  const skillsSection = document.querySelector(".skills");

  if (skillsSection) {
    const skillsBackground = skillsSection.querySelector(".skills-bg");
    const layers = skillsBackground
      ? Array.from(skillsBackground.querySelectorAll("ul"))
      : [];

    const logoFiles = [
      "adobe.svg",
      "android.svg",
      "bootstrap.svg",
      "canva.svg",
      "css3.svg",
      "database.svg",
      "django.svg",
      "figma.svg",
      "github.svg",
      "illustrator.svg",
      "indesign.svg",
      "js.svg",
      "linkedin.svg",
      "linux.svg",
      "notion.svg",
      "photoshop.svg",
      "python.svg",
      "ubuntu.svg",
    ];

    function resolveStaticImage(fileName) {
      const stylesheet = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]')
      ).find((link) => {
        try {
          return new URL(link.href).pathname.endsWith("/css/styles.css");
        } catch {
          return false;
        }
      });

      if (stylesheet) {
        return new URL(`../img/${fileName}`, stylesheet.href).href;
      }

      return new URL(`/static/img/${fileName}`, window.location.origin).href;
    }

    function generateSkillLogos() {
      if (!skillsBackground || layers.length === 0) return;

      layers.forEach((layer) => layer.replaceChildren());

      const bounds = skillsSection.getBoundingClientRect();
      const width = bounds.width;
      const height = bounds.height;

      if (width <= 0 || height <= 0) return;

      let spacing = 280;

      if (width < 500) {
        spacing *= 0.6;
      } else if (width < 900) {
        spacing *= 0.8;
      }

      const columns = Math.max(1, Math.floor(width / spacing));
      const rows = Math.max(3, Math.ceil(height / spacing));
      const horizontalSpacing = width / columns;
      const verticalSpacing = height / rows;

      let index = 0;

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const layer = layers[(row + column) % layers.length];

          const slot = document.createElement("li");
          slot.className = "skill-slot";
          slot.style.left =
            `${column * horizontalSpacing + horizontalSpacing / 2}px`;
          slot.style.top =
            `${row * verticalSpacing + verticalSpacing / 2}px`;

          const logo = document.createElement("div");
          logo.className = "skill-logo";
          logo.style.animationDelay =
            `${-(index % 7) * (6 / 7)}s`;

          const image = document.createElement("img");
          image.src = resolveStaticImage(logoFiles[index % logoFiles.length]);
          image.alt = "";
          image.loading = "lazy";
          image.decoding = "async";

          logo.appendChild(image);
          slot.appendChild(logo);
          layer.appendChild(slot);
          index += 1;
        }
      }
    }

    if (skillsBackground && layers.length > 0) {
      const style = document.createElement("style");
      style.textContent = `
        .skills-bg .skill-slot {
          position: absolute;
          display: grid;
          place-items: center;
          transform: translate(-50%, -50%);
        }

        .skills-bg .skill-logo {
          display: grid;
          place-items: center;
          width: clamp(28px, 3.2vw, 56px);
          height: clamp(28px, 3.2vw, 56px);
          opacity: 0;
          animation: skills-appear 6s infinite;
        }

        .skills-bg .skill-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 0 6px #fff) drop-shadow(0 0 12px #fff);
        }

        @keyframes skills-appear {
          0% {
            filter: blur(19px);
            opacity: 0;
            transform: translate(-40px, 40px) scale(0.9);
          }

          40%, 60% {
            filter: blur(0);
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }

          100% {
            filter: blur(19px);
            opacity: 0;
            transform: translate(40px, -40px) scale(0.9);
          }
        }
      `;
      document.head.appendChild(style);

      generateSkillLogos();

      let resizeTimer;
      window.addEventListener(
        "resize",
        () => {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(generateSkillLogos, 150);
        },
        { passive: true }
      );
    }

    const skillsData = {
      frontend: {
        title: "Frontend",
        items: [
          { name: "HTML", percent: 80 },
          { name: "CSS", percent: 70 },
          { name: "JavaScript", percent: 60 },
          { name: "Bootstrap", percent: 70 },
        ],
      },
      backend: {
        title: "Backend",
        items: [
          { name: "Python", percent: 60 },
          { name: "Django", percent: 70 },
          { name: "PostgreSQL", percent: 60 },
          { name: "SQL", percent: 55 },
        ],
      },
      design: {
        title: "Diseño y multimedia",
        items: [
          { name: "Figma", percent: 70 },
          { name: "Photoshop", percent: 70 },
          { name: "Illustrator", percent: 65 },
          { name: "Premiere Pro", percent: 70 },
          { name: "Audition", percent: 70 },
          { name: "InDesign", percent: 70 },
          { name: "Canva", percent: 90 },
        ],
      },
      tools: {
        title: "Herramientas",
        items: [
          { name: "Git / GitHub", percent: 80 },
          { name: "VS Code", percent: 90 },
          { name: "Linux", percent: 60 },
          { name: "Notion", percent: 90 },
        ],
      },
    };

    const categories = skillsSection.querySelectorAll(".skill-category");
    const skillsTitle = skillsSection.querySelector(".skills-title");
    const skillsList = skillsSection.querySelector("#skills-list");

    function renderSkills(categoryName) {
      const data = skillsData[categoryName];
      if (!data || !skillsTitle || !skillsList) return;

      skillsTitle.textContent = data.title;
      skillsList.replaceChildren();

      data.items.forEach((skill) => {
        const row = document.createElement("div");
        row.className = "skill";

        const name = document.createElement("span");
        name.textContent = skill.name;

        const bar = document.createElement("div");
        bar.className = "skill-bar";
        bar.setAttribute("role", "progressbar");
        bar.setAttribute("aria-label", skill.name);
        bar.setAttribute("aria-valuemin", "0");
        bar.setAttribute("aria-valuemax", "100");
        bar.setAttribute("aria-valuenow", String(skill.percent));

        const fill = document.createElement("div");
        fill.className = "skill-fill";
        fill.style.width = `${skill.percent}%`;
        bar.appendChild(fill);

        const percent = document.createElement("span");
        percent.className = "skill-percent";
        percent.textContent = `${skill.percent}%`;

        row.append(name, bar, percent);
        skillsList.appendChild(row);
      });
    }

    categories.forEach((category) => {
      category.setAttribute("role", "button");
      category.setAttribute("tabindex", "0");

      function activateCategory() {
        categories.forEach((item) => {
          item.classList.remove("active");
          item.setAttribute("aria-pressed", "false");
        });

        category.classList.add("active");
        category.setAttribute("aria-pressed", "true");
        renderSkills(category.dataset.category);
      }

      category.addEventListener("click", activateCategory);

      category.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activateCategory();
        }
      });
    });

    const activeCategory =
      skillsSection.querySelector(".skill-category.active") || categories[0];

    if (activeCategory) {
      activeCategory.setAttribute("aria-pressed", "true");
      renderSkills(activeCategory.dataset.category);
    }
  }

  /* =====================================================
     PROYECTOS: EFECTO DE BRILLO
     ===================================================== */

  document.querySelectorAll(".project").forEach((project) => {
    project.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;

      const bounds = project.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;

      project.style.setProperty("--mx", `${x}%`);
      project.style.setProperty("--my", `${y}%`);
    });

    project.addEventListener("pointerleave", () => {
      project.style.setProperty("--mx", "50%");
      project.style.setProperty("--my", "50%");
    });
  });

  /* =====================================================
     PARTÍCULAS
     ===================================================== */

  const particlesElement = document.getElementById("tsparticles");
  let particlesInstance = null;
  let particlesRequest = 0;

  function getParticlesColor() {
    return (
      getComputedStyle(body).getPropertyValue("--particles-color").trim() ||
      "#000"
    );
  }

  async function loadParticles() {
    if (!particlesElement || !window.tsParticles) return;

    const request = ++particlesRequest;

    try {
      const instance = await window.tsParticles.load("tsparticles", {
        fullScreen: { enable: false },
        background: { color: "transparent" },
        particles: {
          number: { value: 30 },
          color: { value: getParticlesColor() },
          shape: { type: "circle" },
          opacity: { value: 0.5 },
          size: { value: 2 },
          links: {
            enable: true,
            distance: 120,
            color: getParticlesColor(),
            opacity: 0.3,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: "none",
            outModes: { default: "bounce" },
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "grab" },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              links: { opacity: 0.5 },
            },
          },
        },
      });

      if (request !== particlesRequest) {
        instance?.destroy();
        return;
      }

      particlesInstance = instance;
    } catch (error) {
      console.warn("No se pudieron cargar las partículas.", error);
    }
  }

  if (particlesElement && window.tsParticles) {
    loadParticles();

    const themeObserver = new MutationObserver(() => {
      particlesRequest += 1;
      particlesInstance?.destroy();
      particlesInstance = null;
      loadParticles();
    });

    themeObserver.observe(body, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  /* =====================================================
     COMPARADOR DE TEMA EN CONTACTO
     ===================================================== */

  document.querySelectorAll(".theme-compare").forEach((container) => {
    const handle = container.querySelector(".theme-handle");
    const heading = container.querySelector(".contact-heading");

    if (!handle || !heading) return;

    let dragging = false;

    handle.setAttribute("role", "slider");
    handle.setAttribute("aria-label", "Divisor entre tema claro y oscuro");
    handle.setAttribute("aria-valuemin", "8");
    handle.setAttribute("aria-valuemax", "92");
    handle.setAttribute("aria-orientation", "horizontal");
    handle.setAttribute("tabindex", "0");

    function setDividerPercent(value) {
      const percent = Math.max(8, Math.min(92, value));

      container.style.setProperty("--divider", `${percent}%`);
      container.setAttribute(
        "data-theme",
        percent > 50 ? "dark" : "light"
      );
      handle.setAttribute("aria-valuenow", String(Math.round(percent)));

      const leftHeading = heading.querySelector(".heading-left");
      const rightHeading = heading.querySelector(".heading-right");

      if (leftHeading) {
        leftHeading.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      }

      if (rightHeading) {
        rightHeading.style.clipPath = `inset(0 0 0 ${percent}%)`;
      }
    }

    function updateFromPointer(clientX) {
      const bounds = container.getBoundingClientRect();
      if (bounds.width <= 0) return;

      const percent = ((clientX - bounds.left) / bounds.width) * 100;
      setDividerPercent(percent);
    }

    handle.addEventListener("pointerdown", (event) => {
      dragging = true;
      handle.classList.add("dragging");
      handle.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    });

    handle.addEventListener("pointermove", (event) => {
      if (dragging) updateFromPointer(event.clientX);
    });

    function stopDragging() {
      dragging = false;
      handle.classList.remove("dragging");
    }

    handle.addEventListener("pointerup", stopDragging);
    handle.addEventListener("pointercancel", stopDragging);
    handle.addEventListener("lostpointercapture", stopDragging);

    container.addEventListener("click", (event) => {
      if (
        event.target.closest(
          ".theme-handle, .contact-content, .contact-heading, .contact-inner"
        )
      ) {
        return;
      }

      updateFromPointer(event.clientX);
    });

    handle.addEventListener("keydown", (event) => {
      const current =
        Number.parseFloat(
          getComputedStyle(container).getPropertyValue("--divider")
        ) || 50;

      const step = event.shiftKey ? 10 : 2;
      let nextValue = current;

      if (event.key === "ArrowLeft") nextValue -= step;
      else if (event.key === "ArrowRight") nextValue += step;
      else if (event.key === "Home") nextValue = 8;
      else if (event.key === "End") nextValue = 92;
      else return;

      event.preventDefault();
      setDividerPercent(nextValue);
    });

    setDividerPercent(50);
  });
});
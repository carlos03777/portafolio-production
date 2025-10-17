/* ======================================================
   script.js
   Portafolio Interactivo
   - Efecto subrayado SVG con GSAP
   - Menú hamburguesa responsivo
   - Animación hero
   - Interactividad sección About + tarjeta holográfica
====================================================== */

/* ============================
   1. Subrayado aleatorio en links
============================ */
const svgVariants = [
  `<svg width="310" height="40" viewBox="0 0 310 40"><path d="M5 21C26.8 16.2 49.6 11.6 71.8 14.7C85 16.5 97 21.8 110 24.4C116.4 25.65 123 25.51 129 22.64C136 19.33 142.6 15.14 150 13.33C157 11.72 162 14.62 168 16.83C182 21.72 195 22.62 209 21.39C225 20.05 240 17.99 255 18.31C272 18.64 288 18.87 305 18" stroke="currentColor" stroke-width="8" stroke-linecap="round" fill="none"/></svg>`,
  `<svg width="310" height="40" viewBox="0 0 310 40"><path d="M5 25C26.2 20.3 47.7 17 69.1 13.84C98 9.6 128.4 4.02 158 5.15C172.6 5.7 187.7 8.66 201.6 11.97C207.2 13.3 215.4 14.94 220.1 18.36C224.4 21.46 220.7 25.66 217.2 27.62C208.3 32.51 197.2 34.28 186.7 34.85C183.2 35.04 147.2 36.26 155.1 26.58C158.1 22.9 163 20.62 167.8 18.79C178.4 14.72 190.1 12.11 201.6 10.4C218.4 7.9 235.5 7.06 252.5 7.49C258.5 7.64 264.4 7.93 270.3 8.42C280.3 9.25 296 10.9 305 13" stroke="currentColor" stroke-width="8" stroke-linecap="round" fill="none"/></svg>`,
  `<svg width="310" height="40" viewBox="0 0 310 40"><path d="M5 30C53 27 99 22 146 17C152 16.7 157 16 162 15.65C163 15.6 165 15.4 164 16.43C162 20.36 157 23.76 154 27.5C153 28.37 148 33.47 151 34.66C154 36.08 164 32.6 165 32.2C179 28.36 191 23.6 205 19.54C232 11.34 259 5.83 289 5.12" stroke="currentColor" stroke-width="8" stroke-linecap="round" fill="none"/></svg>`
];

function svgFromString(svgString) {
  const wrap = document.createElement("div");
  wrap.innerHTML = svgString.trim();
  return wrap.firstElementChild;
}

function prepareSVG(svgEl) {
  svgEl.classList.add("text-draw__box-svg");
  svgEl.setAttribute("preserveAspectRatio", "none");
  svgEl.querySelectorAll("path").forEach(path => {
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
  });
  return svgEl;
}

function initDrawRandomUnderline() {
  let nextIndex = Math.floor(Math.random() * svgVariants.length);
  const containers = document.querySelectorAll("[data-draw-line]");

  containers.forEach(container => {
    const box = container.querySelector("[data-draw-line-box]");
    if (!box) return;

    let currentTween = null;
    let leaveTween = null;

    container.addEventListener("mouseenter", () => {
      if (currentTween?.isActive()) return;
      if (leaveTween?.isActive()) {
        leaveTween.kill();
        leaveTween = null;
      }

      box.innerHTML = "";
      const svgEl = prepareSVG(svgFromString(svgVariants[nextIndex]));
      box.appendChild(svgEl);

      const path = svgEl.querySelector("path");
      if (path) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;

        currentTween = gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.55,
          ease: "power2.inOut",
          onComplete: () => (currentTween = null)
        });
      }

      nextIndex = (nextIndex + 1) % svgVariants.length;
    });

    container.addEventListener("mouseleave", () => {
      const path = box.querySelector("path");
      if (!path) return (box.innerHTML = "");

      const playOut = () => {
        if (currentTween?.isActive()) currentTween.kill();
        const len = path.getTotalLength();
        leaveTween = gsap.to(path, {
          strokeDashoffset: -len,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => (box.innerHTML = "")
        });
      };

      currentTween?.isActive()
        ? currentTween.eventCallback("onComplete", playOut)
        : playOut();
    });

    container.addEventListener("touchstart", ev => {
      ev.preventDefault();
      container.dispatchEvent(new Event("mouseenter"));
      setTimeout(() => container.dispatchEvent(new Event("mouseleave")), 900);
    }, { passive: false });
  });
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", initDrawRandomUnderline)
  : initDrawRandomUnderline();



  const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});



// togle
// ======================
// DARK MODE TOGGLE
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  const body = document.body;

  // 1. Cargar preferencia previa si existe
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
    toggle.textContent = "☀️"; // sol si está oscuro
  } else {
    toggle.textContent = "🌙"; // luna si está claro
  }

  // 2. Click para alternar
  toggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");

    toggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});





/* ============================
   2. Menú hamburguesa
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const toggleMenu = document.querySelector(".navbar-toggle");
  const links = document.querySelector(".navbar-links");

  if (toggleMenu && links) {
    toggleMenu.addEventListener("click", () => {
      links.classList.toggle("active");
      toggleMenu.classList.toggle("open");
    });
  }
});

/* ============================
   HERO: Rotación de palabras + animación img
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const words = ["solve.", "design.", "build.", "write.", "create."];
  let index = 0;

  function rotateWords() {
    const prevEl = document.querySelector(".hero-word_prev");
    const currentEl = document.querySelector(".hero-word_current");
    const nextEl = document.querySelector(".hero-word_next");

    if (!prevEl || !currentEl || !nextEl) return;

    const prevIndex = (index - 1 + words.length) % words.length;
    const nextIndex = (index + 1) % words.length;

    prevEl.textContent = words[prevIndex];
    currentEl.textContent = words[index];
    nextEl.textContent = words[nextIndex];

    index = (index + 1) % words.length;
  }

  setInterval(rotateWords, 2500);

  // Animación GSAP de la imagen
  gsap.from(".hero__right img", {
    x: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power2.out"
  });
});

/* ============================
   ABOUT: tarjeta holográfica
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const card3d = document.querySelector("#about .card3d");
  if (!card3d) return; // seguridad, si no existe About no corre

  const glare = card3d.querySelector(".glare");
  const flipBtn = card3d.querySelector(".flip-btn");
  const minimap = document.querySelector("#about .minimap");
  const spans = minimap.querySelectorAll("span");
  const logos = card3d.querySelectorAll(".logo");

  let isFlipped = false;
  let bounds = card3d.getBoundingClientRect();

  function updateMinimap(x, y) {
    spans[0].textContent = `x: ${x}`;
    spans[1].textContent = `y: ${y}`;
  }

  function handleMove(e) {
    const { clientX, clientY } = e;
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;

    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    const rotateX = ((y - centerY) / centerY) * 15;
    const rotateY = ((x - centerX) / centerX) * 15;

    card3d.style.transform = `rotateY(${rotateY}deg) rotateX(${-rotateX}deg)`;
    updateMinimap(Math.round(rotateX), Math.round(rotateY));

    glare.style.background = `
      radial-gradient(circle at ${x}px ${y}px,
      rgba(255,255,255,0.4), transparent 60%)`;

    logos.forEach(logo => {
      const rect = logo.getBoundingClientRect();
      const logoX = rect.left + rect.width / 2;
      const logoY = rect.top + rect.height / 2;
      const dx = clientX - logoX;
      const dy = clientY - logoY;
      const hue = ((Math.atan2(dy, dx) + Math.PI) / (2 * Math.PI)) * 360;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const intensity = Math.max(0.6, 1.2 - distance / 250);
      const rotation = (Date.now() / 10) % 360;

      logo.style.setProperty("--hue", `${hue}deg`);
      logo.style.setProperty("--angle", `${rotation}deg`);
      logo.style.opacity = intensity;
      logo.classList.add("prism");

      const icon = logo.querySelector(".logo-icon");
      if (icon) {
        icon.style.filter = `hue-rotate(${hue}deg) brightness(${1.6 + intensity}) saturate(2)`;
      }
    });
  }

  function handleLeave() {
    card3d.style.transform = "rotateY(0deg) rotateX(0deg)";
    glare.style.background = `radial-gradient(circle, rgba(255,255,255,0.2), transparent 60%)`;

    logos.forEach(logo => {
      logo.style.setProperty("--hue", "0deg");
      logo.style.setProperty("--angle", "0deg");
      logo.style.opacity = 0.15;
      logo.classList.remove("prism");

      const icon = logo.querySelector(".logo-icon");
      if (icon) icon.style.filter = "brightness(1.2)";
    });
  }

  flipBtn.addEventListener("click", () => {
    isFlipped = !isFlipped;
    card3d.setAttribute("data-active", isFlipped);
    flipBtn.setAttribute("aria-pressed", isFlipped);
    card3d.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
  });

  card3d.addEventListener("mousemove", handleMove);
  card3d.addEventListener("mouseleave", handleLeave);

  window.addEventListener("resize", () => {
    bounds = card3d.getBoundingClientRect();
  });
});



/* ============================
   Skills: fondo animado + ventana de categorías
============================ */

document.addEventListener('DOMContentLoaded', () => {
  // Configuración base
  const config = {
    spacing: 180,              // separación base entre logos
    itemsVisible: 18,          // cantidad visible en animación
    duration: 6,               // duración animación (s)
    stagger: 0.12,             // escalonamiento animación
    x: 40,
    y: 40,
    blur: 19,
    imgSize: 'clamp(28px, 3.2vw, 56px)',
    minRows: 4,                // mínimo de filas visibles
  }

  // Logos SVG para el fondo
  const logos = [
    "static/img/adobe.svg", "static/img/android.svg", "static/img/bootstrap.svg",
    "static/img/canva.svg", "static/img/css3.svg", "static/img/database.svg",
    "static/img/django.svg", "static/img/figma.svg", "static/img/github.svg",
    "static/img/illustrator.svg", "static/img/indesign.svg", "static/img/js.svg",
    "static/img/linkedin.svg", "static/img/linux.svg", "static/img/notion.svg",
    "static/img/photoshop.svg", "static/img/python.svg", "static/img/ubuntu.svg",
  ]

  const section = document.querySelector('.skills')
  const bg = section.querySelector('.skills-bg')
  const layers = Array.from(bg.querySelectorAll('ul'))

  // Estilos dinámicos para animación y barras
  const style = document.createElement('style')
  style.textContent = `
    .skills-bg ul {
      position: absolute;
      inset: 0;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .skills-bg .skill-slot {
      position: absolute;
      transform: translate(-50%, -50%);
      display: grid;
      place-items: center;
    }
    .skills-bg .skill-logo {
      display: grid;
      place-items: center;
      width: ${config.imgSize};
      height: ${config.imgSize};
      opacity: 0;
      animation: skills-appear ${config.duration}s infinite;
    }
    .skills-bg .skill-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 0 6px #fff) drop-shadow(0 0 12px #fff);
    }
    @keyframes skills-appear {
      0% {
        filter: blur(${config.blur}px);
        opacity: 0;
        transform: translate(-${config.x}px, ${config.y}px) scale(0.9);
      }
      40%, 60% {
        filter: blur(0);
        opacity: 1;
        transform: translate(0, 0) scale(1);
      }
      100% {
        filter: blur(${config.blur}px);
        opacity: 0;
        transform: translate(${config.x}px, -${config.y}px) scale(0.9);
      }
    }

    .skill-bar {
      background: rgba(255,255,255,0.1);
      border-radius: 10px;
      overflow: hidden;
      height: 10px;
      margin: 0.3rem 0;
    }
    .skill-fill {
      background: var(--accent, #e55050);
      height: 100%;
      transition: width 0.5s ease-in-out;
    }
    .skill-percent {
      font-size: 0.8rem;
      opacity: 0.8;
    }
  `
  document.head.appendChild(style)

  // Generar rejilla de logos animados
  const generateLogos = () => {
    layers.forEach(ul => ul.innerHTML = "")

    const { width: w, height: h } = section.getBoundingClientRect()

    // Ajustar el spacing dinámicamente para asegurar al menos 4 filas
    let spacing = config.spacing
    const rows = Math.floor(h / spacing)
    if (rows < config.minRows) spacing = h / config.minRows

    const cols = Math.floor(w / spacing)
    const offsetX = (w - cols * spacing) / 2
    const offsetY = (h - Math.floor(h / spacing) * spacing) / 2

    let idx = 0
    for (let r = 0; r < Math.floor(h / spacing); r++) {
      for (let c = 0; c < cols; c++) {
        const ul = layers[(r + c) % layers.length]

        const slot = document.createElement('div')
        slot.className = "skill-slot"
        slot.style.left = `${offsetX + c * spacing + spacing / 2}px`
        slot.style.top  = `${offsetY + r * spacing + spacing / 2}px`

        const logoDiv = document.createElement('div')
        logoDiv.className = "skill-logo"
        logoDiv.style.animationDelay = `${-(idx % config.itemsVisible) * (config.duration / config.itemsVisible)}s`

        const img = document.createElement('img')
        img.src = logos[(idx + r + c) % logos.length]
        logoDiv.appendChild(img)

        slot.appendChild(logoDiv)
        ul.appendChild(slot)

        idx++
      }
    }
  }

  window.addEventListener('resize', generateLogos)
  generateLogos()

  /* ============================
     Ventana de categorías
  ============================= */

  const skillsData = {
    frontend: {
      title: "Frontend",
      items: [
        { name: "HTML", percent: 90 },
        { name: "CSS", percent: 85 },
        { name: "JavaScript", percent: 70 },
        { name: "React", percent: 65 },
      ],
    },
    backend: {
      title: "Backend",
      items: [
        { name: "Node.js", percent: 75 },
        { name: "Express", percent: 70 },
        { name: "MongoDB", percent: 60 },
        { name: "SQL", percent: 55 },
      ],
    },
    design: {
      title: "Diseño & Multimedia",
      items: [
        { name: "Figma", percent: 80 },
        { name: "Adobe Photoshop", percent: 70 },
        { name: "Adobe Illustrator", percent: 65 },
        { name: "Premiere Pro", percent: 60 },
      ],
    },
    tools: {
      title: "Herramientas",
      items: [
        { name: "Git / GitHub", percent: 85 },
        { name: "VS Code", percent: 90 },
        { name: "Docker", percent: 50 },
        { name: "Postman", percent: 70 },
      ],
    },
  }

  const categories = document.querySelectorAll(".skill-category")
  const skillsTitle = document.querySelector(".skills-title")
  const skillsList = document.getElementById("skills-list")

  const renderSkills = (category) => {
    const data = skillsData[category]
    skillsTitle.textContent = data.title

    skillsList.innerHTML = data.items.map(skill => `
      <div class="skill">
        <span>${skill.name}</span>
        <div class="skill-bar">
          <div class="skill-fill" style="width: ${skill.percent}%"></div>
        </div>
        <span class="skill-percent">${skill.percent}%</span>
      </div>
    `).join("")
  }

  categories.forEach(cat => {
    cat.addEventListener("click", () => {
      categories.forEach(c => c.classList.remove("active"))
      cat.classList.add("active")
      renderSkills(cat.dataset.category)
    })
  })

  renderSkills("frontend")
})


/* ============================
   4. Projects: efecto glare y particles
============================ */




document.querySelectorAll(".project").forEach(card => {
  const glare = card.querySelector(".project__glare");

  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--mx", `50%`);
    card.style.setProperty("--my", `50%`);
  });
});




function getCSSVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function loadParticles() {
  const color = getCSSVar('--particles-color');

  tsParticles.load("tsparticles", {
    fullScreen: { enable: false },
    background: { color: "transparent" },
    particles: {
      number: { value: 60 },
      color: { value: color },
      shape: { type: "circle" },
      opacity: { value: 0.5 },
      size: { value: 2 },
      links: {
        enable: true,
        distance: 120,
        color: color,
        opacity: 0.3,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: "none",
        outModes: { default: "bounce" }
      }
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          links: { opacity: 0.5 }
        }
      }
    }
  });
}

// 3. Inicializa partículas
loadParticles();

// 4. Observa cambios en el modo (claro/oscuro)
const observer = new MutationObserver(() => {
  tsParticles.domItem(0).destroy();
  loadParticles();
});

observer.observe(document.body, {
  attributes: true,
  attributeFilter: ['class']
});





/*contact*/
// script.js — controla divisor y tema dinámico
document.querySelectorAll('.theme-compare').forEach((container) => {
  const handle = container.querySelector('.theme-handle');
  const heading = container.querySelector('.contact-heading');
  if (!handle || !heading) return;

  let dragging = false;

  function setDividerPercent(pct) {
    const clamped = Math.max(8, Math.min(92, pct));
    container.style.setProperty('--divider', clamped + '%');

    const theme = clamped > 50 ? 'dark' : 'light';
    container.setAttribute('data-theme', theme);

    const left = `polygon(0 0, ${clamped}% 0, ${clamped}% 100%, 0 100%)`;
    const right = `polygon(${clamped}% 0, 100% 0, 100% 100%, ${clamped}% 100%)`;

    const hLeft = heading.querySelector('.heading-left');
    const hRight = heading.querySelector('.heading-right');
    if (hLeft && hRight) {
      hLeft.style.clipPath = left;
      hRight.style.clipPath = right;
    }
  }

  function updateFromEvent(x) {
    const rect = container.getBoundingClientRect();
    const pct = ((x - rect.left) / rect.width) * 100;
    setDividerPercent(pct);
  }

  // Mouse
  handle.addEventListener('mousedown', (e) => {
    dragging = true;
    handle.classList.add('dragging');
    e.preventDefault();
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    handle.classList.remove('dragging');
  });
  window.addEventListener('mousemove', (e) => {
    if (dragging) updateFromEvent(e.clientX);
  });

  // Touch
  handle.addEventListener('touchstart', (e) => {
    dragging = true;
    handle.classList.add('dragging');
    e.preventDefault();
  }, { passive: false });
  window.addEventListener('touchend', () => {
    dragging = false;
    handle.classList.remove('dragging');
  });
  window.addEventListener('touchmove', (e) => {
    if (dragging) updateFromEvent(e.touches[0].clientX);
  }, { passive: false });

  // Click directo
  container.addEventListener('click', (e) => {
    if (e.target !== handle) updateFromEvent(e.clientX);
  });

  // Teclado
  handle.setAttribute('tabindex', '0');
  handle.addEventListener('keydown', (e) => {
    const step = 2;
    const cur = parseFloat(getComputedStyle(container).getPropertyValue('--divider')) || 50;
    if (e.key === 'ArrowLeft') setDividerPercent(cur - step);
    else if (e.key === 'ArrowRight') setDividerPercent(cur + step);
    else if (e.key === 'Home') setDividerPercent(8);
    else if (e.key === 'End') setDividerPercent(92);
  });

  // Inicializa
  setDividerPercent(50);
});

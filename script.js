/* ============================================================
   A/RES — HOME PAGE
   Dynamic capability text: type → hold → delete → next phrase.
   ============================================================ */

(function () {
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  let clickTimeout = null;

  function updateCursorPosition(event) {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }

  window.addEventListener("pointermove", updateCursorPosition, { passive: true });

  window.addEventListener("pointerdown", (event) => {
    updateCursorPosition(event);
    cursor.classList.remove("is-clicking");
    void cursor.offsetWidth;
    cursor.classList.add("is-clicking");

    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      cursor.classList.remove("is-clicking");
    }, 420);
  });

  const phrases = [
    "Web Development",
    "Photography",
    "Videography",
    "Video Editing",
    "Content Ideas",
  ];

  const el = document.getElementById("dynamicText");
  if (el) {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const TYPE_SPEED = 85;
    const DELETE_SPEED = 55;
    const HOLD_TIME = 2100;
    const PAUSE_BEFORE_NEXT = 400;

    let phraseIndex = 0;

    function typePhrase(text, i, callback) {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        setTimeout(() => typePhrase(text, i + 1, callback), TYPE_SPEED);
      } else {
        callback();
      }
    }

    function deletePhrase(text, i, callback) {
      if (i >= 0) {
        el.textContent = text.slice(0, i);
        setTimeout(() => deletePhrase(text, i - 1, callback), DELETE_SPEED);
      } else {
        callback();
      }
    }

    function runCycle() {
      const current = phrases[phraseIndex];

      typePhrase(current, 0, () => {
        setTimeout(() => {
          deletePhrase(current, current.length, () => {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(runCycle, PAUSE_BEFORE_NEXT);
          });
        }, HOLD_TIME);
      });
    }

    function runStatic() {
      el.textContent = phrases[phraseIndex];
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(runStatic, HOLD_TIME + 800);
    }

    if (prefersReducedMotion) {
      runStatic();
    } else {
      runCycle();
    }
  }

  const navbar = document.querySelector(".navbar");
  const indicatorButtons = Array.from(document.querySelectorAll(".scroll-indicator__item"));
  const homeSection = document.getElementById("home");
  const aboutSection = document.getElementById("about");
  const skillsSection = document.getElementById("skills");
  const projectsSection = document.getElementById("projects");
  const contactSection = document.getElementById("contact");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobileQuery = window.matchMedia("(max-width: 767px)");
  let hideTimer = null;

  function setActiveSection(sectionId) {
    indicatorButtons.forEach((button) => {
      const isActive = button.dataset.section === sectionId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "true" : "false");
    });

    const isSectionHiddenNavbar = sectionId === "about" || sectionId === "skills" || sectionId === "projects" || sectionId === "contact";
    document.body.classList.toggle("about-active", isSectionHiddenNavbar);
  }

  function showNavbarTemporarily() {
    if (!document.body.classList.contains("about-active")) {
      return;
    }

    document.body.classList.add("navbar-visible");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      document.body.classList.remove("navbar-visible");
    }, 800);
  }

  function handleSectionState() {
    if (!homeSection || !aboutSection) return;

    const viewportMidpoint = window.innerHeight * 0.45;
    const aboutTop = aboutSection.getBoundingClientRect().top;
    const aboutBottom = aboutSection.getBoundingClientRect().bottom;
    const skillsTop = skillsSection ? skillsSection.getBoundingClientRect().top : Infinity;
    const skillsBottom = skillsSection ? skillsSection.getBoundingClientRect().bottom : 0;
    const projectsTop = projectsSection ? projectsSection.getBoundingClientRect().top : Infinity;
    const projectsBottom = projectsSection ? projectsSection.getBoundingClientRect().bottom : 0;
    const contactTop = contactSection ? contactSection.getBoundingClientRect().top : Infinity;
    const contactBottom = contactSection ? contactSection.getBoundingClientRect().bottom : 0;
    const homeBottom = homeSection.getBoundingClientRect().bottom;

    const isContactActive = contactSection && contactTop <= viewportMidpoint && contactBottom >= window.innerHeight * 0.15;
    const isProjectsActive = projectsSection && projectsTop <= viewportMidpoint && projectsBottom >= window.innerHeight * 0.15 && !isContactActive;
    const isSkillsActive = skillsSection && skillsTop <= viewportMidpoint && skillsBottom >= window.innerHeight * 0.15 && !isProjectsActive && !isContactActive;
    const isAboutActive = aboutTop <= viewportMidpoint && aboutBottom >= window.innerHeight * 0.15 && !isSkillsActive && !isProjectsActive && !isContactActive;
    const isHomeActive = homeBottom > 0 && !isAboutActive && !isSkillsActive && !isProjectsActive && !isContactActive;

    if (isContactActive) {
      setActiveSection("contact");
    } else if (isProjectsActive) {
      setActiveSection("projects");
    } else if (isSkillsActive) {
      setActiveSection("skills");
    } else if (isAboutActive) {
      setActiveSection("about");
    } else if (isHomeActive) {
      setActiveSection("home");
    }

    if (mobileQuery.matches) {
      return;
    }

    if (document.body.classList.contains("about-active") && window.scrollY > 0) {
      document.body.classList.remove("navbar-visible");
    }
  }

  document.addEventListener("mousemove", (event) => {
    if (mobileQuery.matches || !document.body.classList.contains("about-active")) {
      return;
    }

    if (event.clientY <= 80) {
      clearTimeout(hideTimer);
      document.body.classList.add("navbar-visible");
      hideTimer = setTimeout(() => {
        document.body.classList.remove("navbar-visible");
      }, 800);
    } else {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        document.body.classList.remove("navbar-visible");
      }, 800);
    }
  });

  if (mobileQuery.matches) {
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      const currentY = window.scrollY;
      const isScrollingDown = currentY > lastScrollY;

      if (isScrollingDown) {
        document.body.classList.remove("navbar-visible");
      } else {
        document.body.classList.add("navbar-visible");
      }

      lastScrollY = currentY;
      handleSectionState();
    }, { passive: true });
  } else {
    window.addEventListener("scroll", handleSectionState, { passive: true });
  }

  function bindIndicator() {
    indicatorButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const sectionId = button.dataset.section;
        const target = document.getElementById(sectionId);

        if (target) {
          target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
        }
      });
    });
  }

  const webProjects = [
    {
      title: "Portofolio",
      description: "Creative portfolio showcasing web development and visual design work.",
      image: "asset/halaman project 4/web/asset/portofolio.png",
      url: "https://callbyyour.github.io/portofolio/"
    },
    {
      title: "Undangan Digital",
      description: "Digital invitation platform with interactive design and responsive layout.",
      image: "asset/halaman project 4/web/asset/undangan digital.png",
      url: "https://callbyyour.github.io/portofolio/undangan%20digital/index.html"
    }
  ];

  const photographyProjects = [
    { title: "Portrait 01", image: "asset/halaman project 4/foto/poto grph-1.jpeg", aspect: "portrait" },
    { title: "Portrait 02", image: "asset/halaman project 4/foto/poto grph-2.jpeg", aspect: "portrait" },
    { title: "Portrait 03", image: "asset/halaman project 4/foto/poto grph-3.jpeg", aspect: "portrait" },
    { title: "Portrait 04", image: "asset/halaman project 4/foto/poto grph-4.jpeg", aspect: "portrait" },
    { title: "Portrait 05", image: "asset/halaman project 4/foto/foto grph-5.jpeg", aspect: "portrait" },
    { title: "Portrait 06", image: "asset/halaman project 4/foto/foto grph-6.jpeg", aspect: "portrait" },
    { title: "Portrait 07", image: "asset/halaman project 4/foto/foto grph-7.jpeg", aspect: "portrait" },
    { title: "Portrait 08", image: "asset/halaman project 4/foto/foto grph-8.jpeg", aspect: "portrait" },
    { title: "Portrait 09", image: "asset/halaman project 4/foto/foto grph-9.jpeg", aspect: "portrait" }
  ];

  const videographyProjects = [
    { title: "Video 01", video: "asset/halaman project 4/video/video grph-1.mp4", aspect: "portrait" },
    { title: "Video 02", video: "asset/halaman project 4/video/video grph-2.mp4", aspect: "portrait" },
    { title: "Video 03", video: "asset/halaman project 4/video/video grph-3.mp4", aspect: "portrait" },
    { title: "Video 04", video: "asset/halaman project 4/video/video grph-4.mp4", aspect: "portrait" },
    { title: "Video 05", video: "asset/halaman project 4/video/video grph-5.mp4", aspect: "portrait" },
    { title: "Video 06", video: "asset/halaman project 4/video/video grph-6.mp4", aspect: "portrait" },
    { title: "Video 07", video: "asset/halaman project 4/video/video grph-7.mp4", aspect: "portrait" }
  ];

  const projectPanel = document.getElementById("project-panel");
  const projectTabs = Array.from(document.querySelectorAll(".project-tab"));
  let activeCategory = "web";
  let lightbox = null;
  let currentLightboxItems = [];
  let currentLightboxIndex = 0;

  function createPlaceholder(label, tone) {
    const el = document.createElement("div");
    el.className = "project-placeholder";
    el.textContent = label;
    el.setAttribute("aria-label", label);
    if (tone === "light") el.style.background = "rgba(255,255,255,0.04)";
    return el;
  }

  function renderWebProjects() {
    const cards = webProjects.map((project) => {
      const imageMarkup = project.image
        ? `<img src="${project.image}" alt="${project.title}" loading="lazy" />`
        : `<div class="project-placeholder">[ PROJECT IMAGE ]</div>`;

      return `
        <a class="project-card" href="${project.url}" target="_blank" rel="noreferrer noopener" aria-label="View ${project.title}">
          <div class="project-card__image">${imageMarkup}</div>
          <div class="project-card__body">
            <h3 class="project-card__title">${project.title}</h3>
            <p class="project-card__description">${project.description}</p>
            <span class="project-card__meta">VIEW PROJECT →</span>
          </div>
        </a>
      `;
    }).join("");

    return `<div class="project-grid">${cards}</div>`;
  }

  function renderGallery(items, type) {
    const list = items.map((item, index) => {
      if (type === "photography") {
        const imageMarkup = item.image
          ? `<img class="gallery-item__image" src="${item.image}" alt="${item.title}" loading="lazy" />`
          : `<div class="gallery-item__poster">[ PHOTO ]</div>`;

        return `
          <button type="button" class="gallery-item" data-index="${index}" data-type="photography" aria-label="Open ${item.title}">
            ${imageMarkup}
            <span class="gallery-item__overlay"><span class="gallery-item__view">VIEW</span></span>
          </button>
        `;
      }

      const videoMarkup = item.video
        ? `<video class="gallery-item__video" muted playsinline loop preload="metadata" aria-label="${item.title}"><source src="${item.video}" /></video>`
        : `<div class="gallery-item__poster">[ VIDEO ]</div>`;

      return `
        <button type="button" class="gallery-item" data-index="${index}" data-type="videography" aria-label="Open ${item.title}">
          ${videoMarkup}
          <span class="gallery-item__overlay"><span class="gallery-item__view">VIEW</span></span>
          <span class="gallery-item__play" aria-hidden="true">▶</span>
        </button>
      `;
    }).join("");

    return `<div class="gallery">${list}</div>`;
  }

  function renderCategory(category) {
    if (!projectPanel) return;

    projectPanel.classList.add("is-transitioning");
    setTimeout(() => {
      if (category === "web") {
        projectPanel.innerHTML = renderWebProjects();
      } else if (category === "photography") {
        projectPanel.innerHTML = renderGallery(photographyProjects, "photography");
      } else {
        projectPanel.innerHTML = renderGallery(videographyProjects, "videography");
      }

      attachGalleryEvents();
      projectPanel.classList.remove("is-transitioning");
    }, 220);
  }

  function attachGalleryEvents() {
    const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
    galleryItems.forEach((item) => {
      const type = item.dataset.type;
      const video = item.querySelector("video");

      item.addEventListener("mouseenter", () => {
        if (video) {
          video.play().catch(() => {});
        }
      });

      item.addEventListener("mouseleave", () => {
        if (video) {
          video.pause();
        }
      });

      item.addEventListener("click", () => {
        const index = Number(item.dataset.index);
        const list = type === "photography" ? photographyProjects : videographyProjects;
        currentLightboxItems = list;
        currentLightboxIndex = index;
        openLightbox(type, index);
      });
    });
  }

  function openLightbox(type, index) {
    const items = type === "photography" ? photographyProjects : videographyProjects;
    const item = items[index];

    if (!document.body.querySelector(".lightbox")) {
      const lightboxMarkup = `
        <div class="lightbox" aria-modal="true" role="dialog" aria-label="Project preview">
          <div class="lightbox__backdrop"></div>
          <div class="lightbox__dialog">
            <button type="button" class="lightbox__close" aria-label="Close preview">×</button>
            <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous">←</button>
            <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next">→</button>
            <div class="lightbox__media"></div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", lightboxMarkup);
    }

    lightbox = document.body.querySelector(".lightbox");
    const mediaWrap = lightbox.querySelector(".lightbox__media");
    const closeBtn = lightbox.querySelector(".lightbox__close");
    const prevBtn = lightbox.querySelector(".lightbox__nav--prev");
    const nextBtn = lightbox.querySelector(".lightbox__nav--next");
    const backdrop = lightbox.querySelector(".lightbox__backdrop");

    const mediaHtml = type === "photography"
      ? (item.image ? `<img src="${item.image}" alt="${item.title}" />` : `<div class="project-placeholder">[ PHOTO ]</div>`)
      : (item.video ? `<video controls autoplay muted playsinline><source src="${item.video}" /></video>` : `<div class="project-placeholder">[ VIDEO ]</div>`);

    mediaWrap.innerHTML = mediaHtml;
    lightbox.classList.add("is-open");

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      setTimeout(() => {
        lightbox.remove();
        lightbox = null;
      }, 220);
    }

    closeBtn.addEventListener("click", closeLightbox);
    backdrop.addEventListener("click", closeLightbox);

    prevBtn.addEventListener("click", () => {
      const nextIndex = (index - 1 + items.length) % items.length;
      openLightbox(type, nextIndex);
    });

    nextBtn.addEventListener("click", () => {
      const nextIndex = (index + 1) % items.length;
      openLightbox(type, nextIndex);
    });

    document.addEventListener("keydown", function handleKeydown(event) {
      if (!lightbox || !lightbox.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        closeLightbox();
        document.removeEventListener("keydown", handleKeydown);
      }

      if (event.key === "ArrowLeft") {
        const nextIndex = (index - 1 + items.length) % items.length;
        openLightbox(type, nextIndex);
        document.removeEventListener("keydown", handleKeydown);
      }

      if (event.key === "ArrowRight") {
        const nextIndex = (index + 1) % items.length;
        openLightbox(type, nextIndex);
        document.removeEventListener("keydown", handleKeydown);
      }
    });
  }

  function bindProjectTabs() {
    projectTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const category = tab.dataset.category;
        if (!category || category === activeCategory) return;

        activeCategory = category;
        projectTabs.forEach((button) => {
          const isActive = button.dataset.category === category;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-selected", String(isActive));
        });

        renderCategory(category);
      });
    });
  }

  bindProjectTabs();
  renderCategory(activeCategory);

  bindIndicator();
  handleSectionState();

  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  if (aboutSection) {
    aboutObserver.observe(aboutSection);
  }

  if (skillsSection) {
    aboutObserver.observe(skillsSection);
    skillsSection.classList.add("is-visible");
  }

  if (projectsSection) {
    aboutObserver.observe(projectsSection);
  }

  if (navbar) {
    navbar.addEventListener("mouseenter", showNavbarTemporarily);
    navbar.addEventListener("mouseleave", () => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (document.body.classList.contains("about-active")) {
          document.body.classList.remove("navbar-visible");
        }
      }, 800);
    });
  }
})();
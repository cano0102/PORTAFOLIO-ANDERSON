/* ==========================================================================
   PORTAFOLIO · ANDERSON AC — main.js
   --------------------------------------------------------------------------
   Módulos
   1. Utilidades y toast
   2. Header (scroll, barra de progreso, volver arriba)
   3. Navegación (menú móvil, indicador, scroll spy)
   4. Hero (texto que se escribe, tilt 3D de la foto, partículas)
   5. Aparición al hacer scroll (reveal)
   6. Efecto foco en tarjetas
   7. Proyectos (render desde imagenes.json)
   8. Copiar correo y formulario de contacto
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- 1. Utilidades y toast ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const EMAIL = 'canoanderson201@gmail.com';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const toast = $('#toast');
  let toastTimer;

  function showToast(message, icon = 'fa-circle-check') {
    if (!toast) return;
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
  }

  // Escapa texto antes de inyectarlo en innerHTML
  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  /* ---------- 2. Header ---------- */
  const header = $('#header');
  const progress = $('#scrollProgress');
  const backTop = $('#backTop');
  let scrollTicking = false;

  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header?.classList.toggle('is-scrolled', y > 20);
      backTop?.classList.toggle('is-visible', y > 600);
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }
      scrollTicking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- 3. Navegación ---------- */
  const nav = $('#nav');
  const navToggle = $('#navToggle');
  const navBackdrop = $('#navBackdrop');
  const navLinks = $$('.nav__link');
  const indicator = $('#navIndicator');
  const desktopQuery = window.matchMedia('(min-width: 900px)');

  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('nav-open', open);
  }

  navToggle?.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  navBackdrop?.addEventListener('click', () => setNav(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
  navLinks.forEach((link) => link.addEventListener('click', () => setNav(false)));
  desktopQuery.addEventListener('change', (e) => { if (e.matches) setNav(false); });

  // Indicador luminoso bajo el enlace activo / en hover
  function moveIndicator(link) {
    if (!indicator || !link || !desktopQuery.matches) return;
    indicator.style.width = `${Math.max(link.offsetWidth - 20, 0)}px`;
    indicator.style.left = `${link.offsetLeft + 10}px`;
  }

  const activeLink = () => $('.nav__link.is-active');

  function setActive(id) {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) moveIndicator(link);
    });
  }

  navLinks.forEach((link) => link.addEventListener('mouseenter', () => moveIndicator(link)));
  nav?.addEventListener('mouseleave', () => moveIndicator(activeLink()));
  window.addEventListener('resize', () => moveIndicator(activeLink()));
  window.addEventListener('load', () => moveIndicator(activeLink()));
  document.fonts?.ready.then(() => moveIndicator(activeLink()));
  moveIndicator(activeLink());

  // Scroll spy: marca la sección visible
  const sections = $$('main section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-35% 0px -60% 0px', threshold: 0 });
    sections.forEach((section) => spy.observe(section));

    // Al llegar al final de la página, activa la última sección
    window.addEventListener('scroll', () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) setActive(sections[sections.length - 1].id);
    }, { passive: true });
  }

  /* ---------- 4. Hero ---------- */

  // 4a. Texto que se escribe
  const typed = $('#typed');
  const roles = ['Desarrollador Web', 'Backend Developer', 'Apasionado por la tecnología'];

  if (typed) {
    if (reduceMotion) {
      typed.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const word = roles[roleIndex];
        charIndex += deleting ? -1 : 1;
        typed.textContent = word.slice(0, charIndex);

        let wait = deleting ? 40 : 85;
        if (!deleting && charIndex === word.length) {
          wait = 1900;
          deleting = true;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          wait = 350;
        }
        setTimeout(tick, wait);
      };

      setTimeout(tick, 900);
    }
  }

  // 4b. Tilt 3D de la foto siguiendo el cursor
  const tilt = $('#tilt');
  const hero = $('#inicio');

  if (tilt && hero && finePointer && !reduceMotion) {
    let raf;
    hero.addEventListener('mousemove', (e) => {
      const rect = tilt.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        tilt.style.transform = `rotateY(${(x * 14).toFixed(2)}deg) rotateX(${(-y * 14).toFixed(2)}deg)`;
      });
    });
    hero.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      tilt.style.transform = '';
    });
  }

  // 4c. Red de partículas en el fondo del hero
  const canvas = $('#particles');

  if (canvas && hero && !reduceMotion && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const mouse = { x: -9999, y: -9999 };
    const LINK_DIST = 130;
    let width = 0;
    let height = 0;
    let points = [];
    let raf = null;
    let inView = true;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(90, Math.floor((width * height) / 16000));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Repulsión suave del cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        if (dx * dx + dy * dy < 160 * 160) {
          p.x -= dx * 0.004;
          p.y -= dy * 0.004;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 201, 255, 0.7)';
        ctx.fill();

        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          const ex = p.x - q.x;
          const ey = p.y - q.y;
          const dist2 = ex * ex + ey * ey;
          if (dist2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(dist2) / LINK_DIST) * 0.35;
            ctx.strokeStyle = `rgba(0, 191, 255, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (raf === null && inView && !document.hidden) raf = requestAnimationFrame(frame);
    }

    function stop() {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    hero.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });
    hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        inView ? start() : stop();
      }).observe(hero);
    }
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    resize();
    start();
  }

  /* ---------- 5. Aparición al hacer scroll ---------- */
  let revealObserver = null;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');
        // Al terminar la animación se retiran las clases para que los hovers funcionen con normalidad
        const done = (e) => {
          if (e.target !== el) return;
          el.classList.remove('reveal', 'reveal--left', 'reveal--right', 'is-visible');
          el.removeEventListener('animationend', done);
        };
        el.addEventListener('animationend', done);
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  }

  function observeReveal(el) {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.remove('reveal', 'reveal--left', 'reveal--right');
  }

  $$('.reveal').forEach(observeReveal);

  /* ---------- 6. Efecto foco en tarjetas ---------- */
  if (finePointer) {
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest?.('.card, .skill, .project');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    }, { passive: true });
  }

  /* ---------- 7. Proyectos ---------- */
  const FALLBACK_IMAGES = {
    1: './css/img/etherium.png',
    2: './css/img/Captura de pantalla 2026-07-29 142813.png',
    3: './css/img/Gestor.ganado-foto-perfil.png',
  };

  function renderProjects(list, grid) {
    grid.innerHTML = '';

    if (!list.length) {
      grid.innerHTML = '<p class="projects-empty">Pronto habrá nuevos proyectos por aquí.</p>';
      return;
    }

    list.forEach((project, index) => {
      const image = project.imagen || FALLBACK_IMAGES[project.id] || '';
      const tags = (project.tecnologias || []).map((t) => `<li>${esc(t)}</li>`).join('');

      const article = document.createElement('article');
      article.className = 'project reveal';
      article.style.setProperty('--i', index);
      article.innerHTML = `
        <div class="project__media">
          <span class="project__num">${String(index + 1).padStart(2, '0')}</span>
          ${image ? `<img src="${esc(image)}" alt="Captura del proyecto ${esc(project.titulo)}" loading="lazy" decoding="async">` : ''}
        </div>
        <div class="project__body">
          <h3 class="project__title">${esc(project.titulo)}</h3>
          <p class="project__desc">${esc(project.descripcion)}</p>
          <ul class="project__tags" aria-label="Tecnologías">${tags}</ul>
          <div class="project__actions">
            ${project.link ? `
              <a class="btn btn--primary btn--sm" href="${esc(project.link)}" target="_blank" rel="noopener noreferrer">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Ver proyecto
              </a>` : ''}
            ${project.linkVerCodigo ? `
              <a class="btn btn--ghost btn--sm" href="${esc(project.linkVerCodigo)}" target="_blank" rel="noopener noreferrer">
                <i class="fa-brands fa-github"></i> Código
              </a>` : ''}
          </div>
        </div>`;

      grid.appendChild(article);
      observeReveal(article);
    });
  }

  async function loadProjects() {
    const grid = $('#projectsGrid');
    if (!grid) return;

    try {
      const response = await fetch('./js/imagenes.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      renderProjects(data.imagenes || [], grid);
    } catch (error) {
      console.error('No se pudieron cargar los proyectos:', error);
      grid.innerHTML = '<p class="projects-empty">No se pudieron cargar los proyectos. Intenta recargar la página.</p>';
    }
  }

  loadProjects();

  /* ---------- 8. Copiar correo y formulario ---------- */
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      showToast('Correo copiado al portapapeles');
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }

  $$('.js-copy-email').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      copyEmail();
    });
  });

  const form = $('#contactForm');

  if (form) {
    const status = $('#formStatus');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitIcon = submitBtn?.querySelector('i');
    const fields = $$('.field', form);

    const setStatus = (text, type = '') => {
      if (!status) return;
      status.textContent = text;
      status.className = `form-status${type ? ` is-${type}` : ''}`;
    };

    // Validación visual campo a campo
    const validate = () => {
      let valid = true;
      fields.forEach((field) => {
        const input = field.querySelector('input, textarea');
        const ok = input.checkValidity();
        field.classList.toggle('is-invalid', !ok);
        if (!ok) valid = false;
      });
      return valid;
    };

    fields.forEach((field) => {
      const input = field.querySelector('input, textarea');
      input.addEventListener('input', () => field.classList.remove('is-invalid'));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validate()) {
        setStatus('Por favor completa todos los campos correctamente.', 'err');
        return;
      }

      submitBtn?.classList.add('is-loading');
      if (submitBtn) submitBtn.disabled = true;
      if (submitIcon) submitIcon.className = 'fa-solid fa-spinner';
      setStatus('Enviando...');

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        form.reset();
        setStatus('¡Mensaje enviado! Te responderé lo antes posible.', 'ok');
        showToast('Mensaje enviado correctamente', 'fa-paper-plane');
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        setStatus('No se pudo enviar el mensaje. Inténtalo de nuevo o escríbeme directamente al correo.', 'err');
      } finally {
        submitBtn?.classList.remove('is-loading');
        if (submitBtn) submitBtn.disabled = false;
        if (submitIcon) submitIcon.className = 'fa-solid fa-paper-plane';
      }
    });
  }

  /* ---------- Año del footer ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();

/* ==========================================================================
   Portfolio — Interactions
   1. Thème clair / sombre
   2. Menu mobile
   3. Header au scroll + bouton retour en haut
   4. Apparition au scroll (reveal)
   5. Compteurs animés
   6. Texte qui s'écrit (rôles)
   7. Filtres projets
   8. Lien actif dans la navigation
   9. Formulaire de contact
  10. Petits effets (tilt, toasts, année)
   ========================================================================== */
(() => {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ------------------------------------------------------------------ */
  /* 1. Thème clair / sombre                                             */
  /* ------------------------------------------------------------------ */
  const THEME_COLORS = { dark: '#070a12', light: '#f6f7fb' };
  const themeBtn = $('#theme-toggle');
  const themeMeta = $('meta[name="theme-color"]');

  function applyTheme(theme, persist = true) {
    root.setAttribute('data-theme', theme);

    if (themeBtn) {
      // aria-pressed = true lorsque le thème clair est actif
      themeBtn.setAttribute('aria-pressed', String(theme === 'light'));
      themeBtn.setAttribute(
        'aria-label',
        theme === 'light' ? 'Activer le thème sombre' : 'Activer le thème clair'
      );
    }

    if (themeMeta) themeMeta.setAttribute('content', THEME_COLORS[theme] || THEME_COLORS.dark);

    if (persist) {
      try { localStorage.setItem('theme', theme); } catch (error) { /* stockage bloqué */ }
    }
  }

  // Synchronise l'état du bouton avec le thème déjà appliqué dans <head>.
  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark', false);

  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
  });

  /* ------------------------------------------------------------------ */
  /* 2. Menu mobile                                                     */
  /* ------------------------------------------------------------------ */
  const nav = $('#primary-nav');
  const burger = $('#burger');
  const mobileQuery = window.matchMedia('(max-width: 860px)');

  function setNav(open) {
    if (!nav || !burger) return;
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }

  burger?.addEventListener('click', () => {
    setNav(!nav.classList.contains('is-open'));
  });

  nav?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setNav(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
      setNav(false);
      burger?.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!nav?.classList.contains('is-open')) return;
    if (event.target.closest('#primary-nav') || event.target.closest('#burger')) return;
    setNav(false);
  });

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', (event) => {
      if (!event.matches) setNav(false);
    });
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener((event) => {
      if (!event.matches) setNav(false);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 3. Header au scroll + retour en haut                                */
  /* ------------------------------------------------------------------ */
  const header = $('#site-header');
  const toTop = $('#to-top');

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    header?.classList.toggle('is-scrolled', y > 8);
    toTop?.classList.toggle('is-visible', y > 700);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });

  /* ------------------------------------------------------------------ */
  /* 4. Apparition au scroll                                            */
  /* ------------------------------------------------------------------ */
  const revealItems = $$('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------ */
  /* 5. Compteurs animés                                                */
  /* ------------------------------------------------------------------ */
  const counters = $$('[data-count]');

  function animateCounter(element) {
    const target = Number(element.dataset.count) || 0;
    const duration = 1500;

    if (reduceMotion.matches) {
      element.textContent = String(target);
      return;
    }

    element.textContent = '0';
    const startTime = performance.now();

    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  if (counters.length) {
    if ('IntersectionObserver' in window) {
      const countersObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            countersObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((counter) => countersObserver.observe(counter));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 6. Texte qui s'écrit                                               */
  /* ------------------------------------------------------------------ */
  const typedElement = $('#typed');
  const phrases = [
    'des apps web en MEARN.',
    'des apps mobiles Flutter.',
    'des interfaces React Native.',
    'des API Node.js solides.'
  ];

  if (typedElement) {
    if (reduceMotion.matches) {
      typedElement.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const current = phrases[phraseIndex];

        if (!deleting) {
          charIndex += 1;
          typedElement.textContent = current.slice(0, charIndex);

          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, 2200); // pause en fin de phrase
            return;
          }
          setTimeout(tick, 50 + Math.random() * 45);
        } else {
          charIndex -= 1;
          typedElement.textContent = current.slice(0, charIndex);

          if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(tick, 350);
            return;
          }
          setTimeout(tick, 26);
        }
      };

      setTimeout(tick, 650);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 7. Filtres projets                                                 */
  /* ------------------------------------------------------------------ */
  const filters = $$('.filter');
  const projects = $$('.project');

  function applyFilter(filter) {
    projects.forEach((project) => {
      const matches = filter === 'all' || project.dataset.category === filter;
      project.classList.toggle('is-hidden', !matches);

      if (matches) {
        project.classList.add('is-visible');
        project.classList.remove('is-filtering');
        void project.offsetWidth; // relance l'animation
        project.classList.add('is-filtering');
      }
    });
  }

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('is-active')) return;

      filters.forEach((other) => {
        const active = other === button;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-pressed', String(active));
      });

      applyFilter(button.dataset.filter || 'all');
    });
  });

  /* ------------------------------------------------------------------ */
  /* 8. Lien actif dans la navigation                                   */
  /* ------------------------------------------------------------------ */
  const sectionIds = ['apropos', 'competences', 'projets', 'parcours', 'contact'];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = new Map();

  $$('.nav__link').forEach((link) => {
    const id = link.getAttribute('href')?.replace('#', '');
    if (id) navLinks.set(id, link);
  });

  function setActiveLink(id) {
    navLinks.forEach((link, key) => {
      const active = key === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  if (sections.length && 'IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => spyObserver.observe(section));
  }

  /* ------------------------------------------------------------------ */
  /* 9. Formulaire de contact                                           */
  /* ------------------------------------------------------------------ */
  const form = $('#contact-form');

  if (form) {
    const status = $('#form-status');
    const submitBtn = $('#submit-btn');

    // L'e-mail est lu depuis le lien mailto présent dans la page :
    // une seule adresse à modifier dans index.html.
    const mailLink = $('a[href^="mailto:"]');
    const contactEmail = (mailLink?.getAttribute('href') || 'mailto:contact@votrenom.dev')
      .replace('mailto:', '')
      .split('?')[0];

    const validators = {
      name(value) {
        if (value.trim().length < 2) return 'Merci d’indiquer votre nom (2 caractères minimum).';
        return '';
      },
      email(value) {
        if (!value.trim()) return 'Merci d’indiquer votre adresse e-mail.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) {
          return 'Cette adresse e-mail ne semble pas valide.';
        }
        return '';
      },
      message(value) {
        if (value.trim().length < 10) return 'Votre message doit contenir au moins 10 caractères.';
        return '';
      }
    };

    const fieldNames = Object.keys(validators);

    function errorElement(name) {
      return document.getElementById(`${name}-error`);
    }

    function setFieldError(name, message) {
      const input = form.elements[name];
      const slot = errorElement(name);
      if (!input) return;

      if (message) {
        input.setAttribute('aria-invalid', 'true');
        if (slot) slot.textContent = message;
      } else {
        input.removeAttribute('aria-invalid');
        if (slot) slot.textContent = '';
      }
    }

    function validateField(name) {
      const input = form.elements[name];
      if (!input) return true;
      const message = validators[name](input.value);
      setFieldError(name, message);
      return !message;
    }

    fieldNames.forEach((name) => {
      const input = form.elements[name];
      if (!input) return;

      input.addEventListener('blur', () => validateField(name));
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true' && validators[name](input.value) === '') {
          setFieldError(name, '');
        }
        if (status) status.textContent = '';
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const results = fieldNames.map((name) => validateField(name));
      const firstInvalid = fieldNames.find((name, index) => !results[index]);

      if (firstInvalid) {
        form.elements[firstInvalid]?.focus();
        if (status) status.textContent = '';
        return;
      }

      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const subjectValue = form.elements.subject?.value.trim();
      const message = form.elements.message.value.trim();

      const subject = subjectValue || `Nouveau message de ${name}`;
      const body = [
        `Nom : ${name}`,
        `E-mail : ${email}`,
        '',
        message
      ].join('\n');

      submitBtn?.setAttribute('disabled', 'disabled');
      if (status) {
        status.textContent = 'Merci ! Votre logiciel de messagerie va s’ouvrir avec le message pré-rempli.';
      }

      window.location.href =
        `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      form.reset();
      fieldNames.forEach((field) => setFieldError(field, ''));

      window.setTimeout(() => submitBtn?.removeAttribute('disabled'), 1200);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 10. Petits effets                                                  */
  /* ------------------------------------------------------------------ */
  // Année du copyright
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Toast (liens de démonstration)
  const toast = $('#toast');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 4200);
  }

  $$('a[data-placeholder]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showToast('Lien de démonstration — remplacez-le par l’URL de votre projet dans index.html.');
    });
  });

  // Léger effet de parallaxe sur la photo (souris uniquement)
  const photo = $('#hero-photo');
  const photoWrapper = photo?.closest('.hero__visual');

  if (photo && photoWrapper && finePointer.matches && !reduceMotion.matches) {
    let raf = null;

    photoWrapper.addEventListener('pointermove', (event) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = photoWrapper.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        photo.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${y * -8}deg)`;
        raf = null;
      });
    });

    photoWrapper.addEventListener('pointerleave', () => {
      photo.style.transform = '';
    });
  }
})();

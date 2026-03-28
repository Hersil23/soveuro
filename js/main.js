/* ========================================
   SVU — main.js
   Navbar: mobile hamburger toggle only
   (no scroll state — navbar is always dark)
   ======================================== */

(() => {
  'use strict';

  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.navbar__hamburger');

  if (!hamburger) return;

  /* --- Mobile hamburger toggle --- */
  hamburger.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  /* --- Close menu when clicking a nav link --- */
  document.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Abrir menú');
    });
  });
  /* --- Stats counter animation --- */
  const statsBar = document.querySelector('.hero__stats');
  if (statsBar) {
    const counters = statsBar.querySelectorAll('.hero__stat-number[data-target]');
    let animated = false;

    const animateCounters = () => {
      if (animated) return;
      animated = true;

      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        const prefix = counter.dataset.prefix || '';
        const duration = 2000;
        const start = performance.now();

        // Ease-out deceleration curve
        const easeOut = t => 1 - Math.pow(1 - t, 3);

        const step = now => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const value = Math.round(easeOut(progress) * target);
          counter.textContent = prefix + value.toLocaleString('es-VE');

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };

        counter.textContent = prefix + '0';
        requestAnimationFrame(step);
      });
    };

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    observer.observe(statsBar);
  }
})();

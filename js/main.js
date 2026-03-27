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
})();

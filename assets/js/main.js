/**
 * main.js — Page Initialisation
 * DjangoPlay Home Page
 *
 * Handles small page-level utilities that don't belong in theme.js
 * or space.js:
 *
 *   - Set copyright year in footer
 *   - Mark active nav link based on current pathname
 *   - Lazy-load images with data-src (future-proofing)
 *
 * Load this script at the bottom of <body> with defer.
 * It does NOT depend on any external libraries.
 */

(function () {
  'use strict';

  /* ── Copyright year ─────────────────────────────────────────────────────── */

  function setYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── Active nav link ────────────────────────────────────────────────────── */

  /*
   * Adds class "active" to the <a> in .nav-links whose href matches
   * the current page pathname.
   *
   * Examples:
   *   / or /index.html    → marks the "Home" link
   *   /developer.html
   *   or /developer/      → marks the "Developer" link
   */

  function markActiveNav() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;

      // Normalise: strip leading ./ and trailing /
      const normHref = href.replace(/^\.\//, '').replace(/\/$/, '');
      const normPath = path.replace(/\/$/, '') || '/';

      const isHome = (normHref === 'index.html' || normHref === '')
        && (normPath === '/' || normPath === '/index.html' || normPath === '');

      const isMatch = isHome || (normHref && normPath.endsWith(normHref));

      link.classList.toggle('active', isMatch);
    });
  }

  /* ── Lazy image loading ─────────────────────────────────────────────────── */

  /*
   * Any <img data-src="..."> will have its src swapped in once it enters
   * the viewport. Add data-src instead of src to opt in.
   */

  function initLazyImages() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all immediately
      document.querySelectorAll('img[data-src]').forEach(function (img) {
        img.src = img.dataset.src;
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[data-src]').forEach(function (img) {
      observer.observe(img);
    });
  }

  /* ── Section Nav Scroll Spy ────────────────────────────────────────────── */
  function initScrollSpy() {
    const items = document.querySelectorAll('#section-nav .snav-item');
    // Guard: Only run if the side nav exists on this page
    if (items.length === 0) return;

    const sections = Array.from(items).map(function (item) {
      return document.querySelector(item.getAttribute('href'));
    });

    function onScroll() {
      const scrollY = window.scrollY + 120;
      let current = 0;
      sections.forEach(function (sec, i) {
        if (sec && sec.offsetTop <= scrollY) current = i;
      });
      items.forEach(function (item, i) {
        item.classList.toggle('active', i === current);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Boot ───────────────────────────────────────────────────────────────── */

  function init() {
    setYear();
    markActiveNav();
    initLazyImages();
    initScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
/**
 * theme.js — Theme Toggle
 * DjangoPlay Landing Site
 *
 * Responsibilities:
 *   - Read saved theme from localStorage on page load
 *   - Apply "space-theme" class to <html> element
 *   - Wire the toggle button click handler
 *   - Persist user preference to localStorage
 *   - Emit a custom "themechange" event so other scripts can react
 *     (space.js listens for this to start/stop star generation)
 *
 * Storage key: "dp_theme"
 * Values:      "space" | "light"  (default: "light")
 *
 * Usage: include this script in <head> with defer, or at bottom of <body>.
 * The toggle button must have id="theme-toggle-btn".
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'dp_theme';
  const SPACE_CLASS = 'space-theme';
  const SPACE_VALUE = 'space';
  const LIGHT_VALUE = 'light';

  // ── Read saved preference (or default to light) ─────────────────────────
  function getSaved() {
    try {
      return localStorage.getItem(STORAGE_KEY) || LIGHT_VALUE;
    } catch (_) {
      return LIGHT_VALUE;   // localStorage blocked (private mode etc.)
    }
  }

  // ── Write preference ─────────────────────────────────────────────────────
  function save(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (_) { /* silent */ }
  }

  // ── Apply theme to <html> ────────────────────────────────────────────────
  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === SPACE_VALUE) {
      html.classList.add(SPACE_CLASS);
    } else {
      html.classList.remove(SPACE_CLASS);
    }
    // Notify other scripts
    html.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  // ── Toggle between space and light ──────────────────────────────────────
  function toggle() {
    const current = getSaved();
    const next = current === SPACE_VALUE ? LIGHT_VALUE : SPACE_VALUE;
    save(next);
    applyTheme(next);
  }

  // ── Initialise on DOMContentLoaded ──────────────────────────────────────
  function init() {
    // Apply saved theme immediately (avoids flash of wrong theme)
    applyTheme(getSaved());

    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.addEventListener('click', toggle);

      // Accessibility: update aria-label on state change
      document.documentElement.addEventListener('themechange', function (e) {
        const isSpace = e.detail.theme === SPACE_VALUE;
        btn.setAttribute(
          'aria-label',
          isSpace ? 'Switch to light theme' : 'Switch to space theme'
        );
      });

      // Set initial aria-label
      const isSpace = getSaved() === SPACE_VALUE;
      btn.setAttribute(
        'aria-label',
        isSpace ? 'Switch to light theme' : 'Switch to space theme'
      );
    }
  }

  // Run as early as possible to avoid FOUC
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for programmatic use (e.g. in tests or other scripts)
  window.dpTheme = { toggle, getSaved, applyTheme };
}());
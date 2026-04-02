/**
 * space.js — Star Field Generator
 * DjangoPlay Home Page
 *
 * Generates and animates a star field inside #stars when the
 * space theme is active. Listens to the "themechange" custom event
 * dispatched by theme.js to start/stop generation.
 *
 * Three particle types:
 *   - Stars        : small static-ish dots that twinkle
 *   - Shooting stars: occasional streaks that arc across the sky
 *   - Bright flashes: rare, coloured, larger stars that pulse briefly then fade
 *
 * All DOM manipulation is contained within #stars so clearing is trivial.
 * No canvas — pure DOM particles for simplicity and debuggability.
 *
 * Performance note: 280 stars is comfortable on mid-range devices.
 * Reduce NUM_STARS if needed.
 */

(function () {
  'use strict';

  /* ── Config ────────────────────────────────────────────────────────────── */

  const NUM_STARS = 280;
  const STAR_COLORS = [
    '#ffffff', '#ffffff', '#ffffff', '#ffffff',  // mostly white
    'hsl(200,20%,90%)',                           // blue-white
    'hsl(0,20%,90%)',                             // red-white
    'hsl(30,20%,90%)',                            // warm-white
  ];

  // Bright stars: max alive at any time — keeps the field calm
  const BRIGHT_MAX_ALIVE = 4;

  /* ── State ──────────────────────────────────────────────────────────────── */

  let container = null;
  let initialized = false;
  let shootTimer = null;
  let brightTimer = null;
  let brightAlive = 0;       // tracks how many bright stars are currently visible

  /* ── Helpers ────────────────────────────────────────────────────────────── */

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ── Star creation ──────────────────────────────────────────────────────── */

  function createStar() {
    const el = document.createElement('div');
    el.className = 'star';

    // Size: most are 1-2px, occasional larger
    const size = Math.random() < 0.08 ? rand(2.5, 4) : rand(0.8, 2);
    const dur = rand(2, 5);
    const delay = rand(0, dur);
    const anim = Math.random() < 0.6 ? 'twinkle' : 'twinkle-soft';

    Object.assign(el.style, {
      width: size + 'px',
      height: size + 'px',
      left: rand(0, 100) + '%',
      top: rand(0, 100) + '%',
      background: pick(STAR_COLORS),
      opacity: rand(0.2, 1),
      animation: `${anim} ${dur}s ${delay}s ease-in-out infinite`,
    });

    return el;
  }

  /* ── Shooting star ──────────────────────────────────────────────────────── */

  function spawnShootingStar() {
    if (!container || !isActive()) return;

    const el = document.createElement('div');
    el.className = 'shooting-star';

    const angle = rand(30, 60);   // degrees clockwise from vertical
    const dur = rand(0.7, 1.4);

    Object.assign(el.style, {
      left: rand(10, 80) + '%',
      top: rand(5, 55) + '%',
      '--angle': angle + 'deg',
      animation: `shoot ${dur}s linear forwards`,
    });

    container.appendChild(el);

    // Remove after animation ends (+100ms buffer)
    setTimeout(() => el.remove(), (dur * 1000) + 100);

    // Schedule next
    shootTimer = setTimeout(spawnShootingStar, rand(5000, 14000));
  }

  /* ── Bright coloured flash ──────────────────────────────────────────────── */

  const BRIGHT_COLORS = ['#00aaff', '#ff4466', '#ffdd00', '#44ffaa'];

  function spawnOneBrightStar() {
    if (!container || !isActive()) return;
    if (brightAlive >= BRIGHT_MAX_ALIVE) return;  // cap: don't flood

    const color = pick(BRIGHT_COLORS);
    const el = document.createElement('div');
    el.className = 'bright-star';

    const lifeDur = rand(1.5, 2.5);   // animation duration (seconds)
    const lifems = lifeDur * 1000;

    Object.assign(el.style, {
      width: '3px',
      height: '3px',
      left: rand(5, 95) + '%',
      top: rand(5, 90) + '%',
      background: color,
      // Softer glow — reduced spread and opacity so it doesn't "explode"
      boxShadow: `0 0 4px 1px ${color}66`,
      // Blink + fade out: reach peak opacity then fade to 0
      animation: `bright-twinkle ${lifeDur}s ease-in-out forwards`,
    });

    brightAlive++;
    container.appendChild(el);

    // Remove after animation; decrement alive counter
    setTimeout(function () {
      el.remove();
      brightAlive = Math.max(0, brightAlive - 1);
    }, lifems + 100);
  }

  function spawnBrightBatch() {
    if (!isActive()) return;

    // Spawn 1-2 at a time (was 2-3, reduced to keep it calm)
    const count = randInt(1, 2);
    for (let i = 0; i < count; i++) {
      setTimeout(spawnOneBrightStar, i * rand(300, 700));
    }

    // Next batch after a comfortable pause — 6–12 seconds
    brightTimer = setTimeout(spawnBrightBatch, rand(6000, 12000));
  }

  /* ── Init / Teardown ────────────────────────────────────────────────────── */

  function isActive() {
    return document.documentElement.classList.contains('space-theme');
  }

  function startStars() {
    if (initialized) return;

    container = document.getElementById('stars');
    if (!container) return;

    // Build static star field
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < NUM_STARS; i++) {
      fragment.appendChild(createStar());
    }
    container.appendChild(fragment);

    // Start dynamic elements after a short delay
    setTimeout(spawnShootingStar, rand(2000, 5000));
    setTimeout(spawnBrightBatch, rand(3000, 6000));

    initialized = true;
  }

  function stopStars() {
    clearTimeout(shootTimer);
    clearTimeout(brightTimer);
    shootTimer = null;
    brightTimer = null;
    brightAlive = 0;

    if (container) {
      container.innerHTML = '';
    }
    initialized = false;
  }

  /* ── Theme change listener ──────────────────────────────────────────────── */

  document.documentElement.addEventListener('themechange', function (e) {
    if (e.detail.theme === 'space') {
      startStars();
    } else {
      stopStars();
    }
  });

  /* ── Auto-start if theme is already active on load ──────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (isActive()) startStars();
    });
  } else {
    if (isActive()) startStars();
  }

}());
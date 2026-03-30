/**
 * portfolio.js — Portfolio Content Renderer
 * DjangoPlay Landing Site
 *
 * Fetches content.json and populates all sections of developer.html.
 *
 * To update portfolio content: edit content.json only.
 * No changes to developer.html or this file are needed for content updates.
 *
 * Sections rendered:
 *   - meta (page title, description)
 *   - user (name, roles, summary, social links, photo)
 *   - pursuing (AI Ethics card + pillars)
 *   - timeline (career journey, latest first)
 *   - featured project (DjangoPlay)
 *   - oss_libraries (PyPI cards)
 *   - repositories (repo list)
 *   - skills (skill groups)
 */

(function () {
  'use strict';

  /* ── SVG icon map ────────────────────────────────────────────────────── */

  const ICONS = {
    linkedin: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>`,
    gitlab: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 015.1 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.49h8.54l2.44-7.51a.42.42 0 01.58-.17.43.43 0 01.17.17l2.44 7.51 1.22 3.78a.84.84 0 01-.31.94z"/>
    </svg>`,
    github: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>`,
    pypi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>`,
    gh: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>`,
    external: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
            fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    arrow: '→'
  };

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  function set(id, html) {
    const e = document.getElementById(id);
    if (e) e.innerHTML = html;
  }

  function setText(id, text) {
    const e = document.getElementById(id);
    if (e) e.textContent = text;
  }

  function append(id, node) {
    const e = document.getElementById(id);
    if (e) e.appendChild(node);
  }

  function base64ToUtf8(base64) {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, function (c) {
      return c.charCodeAt(0);
    });
    return new TextDecoder('utf-8').decode(bytes);
  }

  /* ── Renderers ───────────────────────────────────────────────────────── */

  function renderMeta(meta) {
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', meta.description);

    // Google Analytics
    if (meta.analytics_id) {
      const s1 = document.createElement('script');
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${meta.analytics_id}`;
      document.head.appendChild(s1);
      const s2 = document.createElement('script');
      s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${meta.analytics_id}');`;
      document.head.appendChild(s2);
    }
  }

  function renderuser(user) {
    setText('user-eyebrow', user.eyebrow);
    setText('user-name-l1', user.name_line1);
    setText('user-name-l2', user.name_line2);

    // Role pills
    const rolesEl = document.getElementById('user-roles');
    if (rolesEl) {
      user.roles.forEach(function (role, i) {
        rolesEl.appendChild(el('span', 'role-pill', role));
        if (i < user.roles.length - 1) {
          rolesEl.appendChild(el('span', 'role-sep', '·'));
        }
      });
    }

    set('user-summary', user.summary);

    // Social links
    const socialEl = document.getElementById('user-social');
    if (socialEl) {
      user.social.forEach(function (s) {
        const a = document.createElement('a');
        a.className = 'social-link';
        a.href = s.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', s.label);
        a.innerHTML = (ICONS[s.icon] || '') + s.label;
        socialEl.appendChild(a);
      });
    }

    const photo = document.getElementById('user-photo');
    if (photo) photo.src = user.photo;
  }

  function renderPursuing(p) {
    setText('pursuing-label', p.label);
    setText('pursuing-title-l1', p.title_line1);
    setText('pursuing-title-l2', p.title_line2);

    const parasEl = document.getElementById('pursuing-paragraphs');
    if (parasEl) {
      p.paragraphs.forEach(function (text) {
        parasEl.appendChild(el('p', 'pursuing-desc', text));
      });
    }

    const pillarsEl = document.getElementById('pursuing-pillars');
    if (pillarsEl) {
      p.pillars.forEach(function (pillar) {
        const d = el('div', 'pillar-item');
        d.appendChild(el('div', 'pillar-icon', pillar.icon));
        d.appendChild(el('div', 'pillar-name', pillar.name));
        d.appendChild(el('div', 'pillar-sub', pillar.sub));
        pillarsEl.appendChild(d);
      });
    }
  }

  function renderTimeline(tl) {
    setText('journey-heading', tl.heading);

    const container = document.getElementById('timeline');
    if (!container) return;

    tl.items.forEach(function (item) {
      const wrapper = el('div',
        'timeline-item' +
        (item.highlight ? ' timeline-item--highlight' : '') +
        (item.future ? ' timeline-item--future' : '')
      );

      // Marker
      const marker = el('div',
        'timeline-marker' +
        (item.highlight ? ' timeline-marker--active' : '') +
        (item.future ? ' timeline-marker--future' : '')
      );
      wrapper.appendChild(marker);

      // Content box
      const content = el('div', 'timeline-content');
      content.appendChild(el('div', 'timeline-period', item.period));
      content.appendChild(el('div', 'timeline-role', item.role));
      content.appendChild(el('div', 'timeline-org', item.org));
      content.appendChild(el('p', 'timeline-desc', item.desc));

      if (item.tags && item.tags.length) {
        const tagsEl = el('div', 'timeline-tags');
        item.tags.forEach(function (tag) {
          tagsEl.appendChild(el('span', 'tl-tag', tag));
        });
        content.appendChild(tagsEl);
      }

      wrapper.appendChild(content);
      container.appendChild(wrapper);
    });
  }

  function renderFeatured(fp) {
    set('fp-tag', fp.tag);

    // Title — split on line break marker in content
    const titleEl = document.getElementById('fp-title');
    if (titleEl) {
      titleEl.innerHTML = fp.title_line1 + '<br/>' + fp.title_line2;
    }

    const parasEl = document.getElementById('fp-paragraphs');
    if (parasEl) {
      fp.paragraphs.forEach(function (text) {
        parasEl.appendChild(el('p', 'featured-desc', text));
      });
    }

    const metaEl = document.getElementById('fp-meta');
    if (metaEl) {
      fp.tags.forEach(function (tag) {
        metaEl.appendChild(el('span', 'meta-tag', tag));
      });
    }

    const linksEl = document.getElementById('fp-links');
    if (linksEl) {
      fp.links.forEach(function (link) {
        const a = el('a', link.primary ? 'btn-primary' : 'btn-outline', link.label);
        a.href = link.url;
        if (!link.primary) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
        linksEl.appendChild(a);
      });
    }

    const statsEl = document.getElementById('fp-stats');
    if (statsEl) {
      fp.stats.forEach(function (stat) {
        const block = el('div', 'stat-block');
        block.appendChild(el('div', 'stat-number', stat.number));
        block.appendChild(el('div', 'stat-label', stat.label));
        block.appendChild(el('div', 'stat-sub', stat.sub));
        statsEl.appendChild(block);
      });
    }
  }

  function renderOSS(libs) {
    const grid = document.getElementById('oss-grid');
    if (!grid) return;

    libs.forEach(function (lib) {
      const card = el('div', 'oss-card');

      const top = el('div', 'oss-card-top');
      const icon = el('div', 'oss-icon', lib.icon);
      icon.style.background = lib.icon_bg;
      top.appendChild(icon);
      top.appendChild(el('span', 'oss-pypi-badge', 'PyPI'));
      card.appendChild(top);

      card.appendChild(el('div', 'oss-name', lib.name));
      card.appendChild(el('p', 'oss-desc', lib.desc));

      const install = el('div', 'oss-install');
      install.innerHTML = `<span class="pip-cmd">pip install</span> <span class="pip-pkg">${lib.name}</span>`;
      card.appendChild(install);

      const footer = el('div', 'oss-footer');
      [['PyPI', lib.links.pypi], ['Source', lib.links.source]].forEach(function (pair) {
        const a = el('a', 'oss-link', pair[0] + ' ' + ICONS.external);
        a.href = pair[1];
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        footer.appendChild(a);
      });
      card.appendChild(footer);

      grid.appendChild(card);
    });
  }

  function renderRepos(repos) {
    const list = document.getElementById('repo-list');
    if (!list) return;

    repos.forEach(function (repo) {
      const a = document.createElement('a');
      a.className = 'repo-item';
      a.href = repo.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      const left = el('div', 'repo-left');

      // Icon — GitHub repos get the GH SVG, others get emoji
      const iconEl = el('div', 'repo-icon');
      if (repo.icon === 'gh') {
        iconEl.innerHTML = ICONS.gh;
        iconEl.style.cssText = 'display:flex;align-items:center;justify-content:center;';
      } else {
        iconEl.textContent = repo.icon;
      }
      left.appendChild(iconEl);

      const info = el('div', 'repo-info');
      info.appendChild(el('div', 'repo-name', repo.name));
      info.appendChild(el('div', 'repo-desc', repo.desc));
      left.appendChild(info);

      const right = el('div', 'repo-right');
      repo.badges.forEach(function (badge) {
        right.appendChild(el('span', 'repo-badge', badge));
      });
      right.appendChild(el('span', 'repo-arrow', ICONS.arrow));

      a.appendChild(left);
      a.appendChild(right);
      list.appendChild(a);
    });
  }

  function renderSkills(skills) {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    skills.forEach(function (group) {
      const div = el('div', 'skill-group' + (group.pursuing ? ' skill-group--pursuing' : ''));

      div.appendChild(el('div', 'skill-group-name', group.group));

      const ul = el('ul', 'skill-list');
      group.items.forEach(function (item) {
        ul.appendChild(el('li', null, item));
      });
      div.appendChild(ul);

      grid.appendChild(div);
    });
  }

  /* ── Bootstrap ───────────────────────────────────────────────────────── */

  function render(data) {
    renderMeta(data.meta);
    renderuser(data.user);
    renderPursuing(data.pursuing);
    renderTimeline(data.timeline);
    renderFeatured(data.featured_project);
    renderOSS(data.oss_libraries);
    renderRepos(data.repositories);
    renderSkills(data.skills);
  }

  function init() {
    // Fetch encoded content.pkg instead of raw json
    fetch('dist/content.pkg')
      .then(function (res) {
        if (!res.ok) throw new Error('content.pkg fetch failed: ' + res.status);
        return res.text();
      })
      .then(function (base64String) {
        // Strip any newlines and decode safely for Unicode (emojis/dashes)
        const cleanB64 = base64String.replace(/\s/g, '');
        const decoded = base64ToUtf8(cleanB64);
        return JSON.parse(decoded);
      })
      .then(render)
      .catch(function (err) {
        console.error('[portfolio.js]', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
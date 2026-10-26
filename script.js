const data = window.PORTFOLIO;
const app = document.getElementById('app');
let active = 0, dragging = false, startX = 0, moved = false, mouseStart = 0;

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sanitizeSrc = s => /^(?:media\/|assets\/|https:\/\/)/.test(s || '') ? s : '';

function renderText(text) {
  const raw = String(text || '').trim();
  if (!raw) return '';
  return `<div class="section-text">${raw.split(/\n\n+/).map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('')}</div>`;
}

function renderMedia(items, label) {
  if (!Array.isArray(items) || !items.length) return '';
  return `<div class="media-grid">${items.map(m => {
    const src = sanitizeSrc(m.src);
    const cap = esc(m.caption || '');
    if (!src) return '';
    return `<figure>${m.type === 'video'
      ? `<video controls preload="metadata" playsinline src="${esc(src)}"></video>`
      : `<img loading="lazy" src="${esc(src)}" alt="${cap || esc(label)}">`}<figcaption>${cap}</figcaption></figure>`;
  }).join('')}</div>`;
}

function cover(p, i) {
  const img = sanitizeSrc(p.coverImage || '');
  return `<button type="button" class="book" data-i="${i}" aria-label="Open ${esc(p.short)}" style="--cover:${esc(p.cover)};--cover-ink:${esc(p.ink)}">` +
    `<span class="book-spine"></span>` +
    `<span class="book-cover ${img ? 'has-cover-image' : ''}">` +
    (img ? `<span class="cover-photo" style="background-image:url('${esc(img)}')"></span><span class="cover-overlay"></span>` : '') +
    `<span class="book-content">` +
    `<span class="book-meta">VOLUME ${esc(p.volume)} / YESEUL HAN</span>` +
    `<span class="book-ornament"></span>` +
    `<span class="book-big">${esc(p.title)}</span>` +
    `<span class="book-foot">${esc(p.short)} · ${esc(p.year)}</span>` +
    `</span></span></button>`;
}

function paintCarousel() {
  const el = document.querySelector('.carousel-scene');
  if (!el) return;
  const n = data.projects.length;
  const radiusX = innerWidth < 750 ? 190 : 280;
  const radiusZ = innerWidth < 750 ? 95 : 145;
  el.querySelectorAll('.book').forEach((b, i) => {
    let off = ((i - active + n + n * 5) % n);
    if (off > n / 2) off -= n;
    const angle = off * 2 * Math.PI / n;
    const x = Math.sin(angle) * radiusX;
    const depth = Math.cos(angle);
    const scale = 0.68 + 0.32 * ((depth + 1) / 2);
    const z = (depth - 1) * radiusZ;
    const rot = -Math.sin(angle) * 38;
    const y = (1 - scale) * 45;
    b.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rot}deg) scale(${scale})`;
    b.style.zIndex = String(Math.round((depth + 1) * 100));
    b.style.opacity = depth < -0.42 ? '.58' : '1';
    b.setAttribute('aria-pressed', i === active ? 'true' : 'false');
  });
  const p = data.projects[active];
  const titleEl = document.querySelector('#selected-title');
  const catEl = document.querySelector('#selected-category');
  if (titleEl) titleEl.textContent = p.short;
  if (catEl) catEl.textContent = p.category;
}

function spin(delta) {
  active = (active + delta + data.projects.length) % data.projects.length;
  paintCarousel();
}

function openSelected() {
  location.hash = 'project/' + data.projects[active].id;
}

function profileSection() {
  const p = data.profile || {};
  return `<section id="home" class="intro-section section-anchor">` +
    `<div class="intro-copy"><div class="eyebrow">01 / THE DESIGNER · ${esc((p.location || '').toUpperCase())}</div>` +
    `<h1>Hi, I'm <em>Yeseul!</em></h1>` +
    `<p class="intro-lead">${esc(p.lead || '')}</p>` +
    `<p class="intro-education">${esc(p.education || '')}</p>` +
    `<div class="intro-columns">` +
    `<div><div class="eyebrow">WHAT I DO</div><p>${esc(p.whatIDo || '')}</p></div>` +
    `<div><div class="eyebrow">MY DESIGN APPROACH</div><p>${esc(p.approach || '')}</p></div>` +
    `<div><div class="eyebrow">DESIGN TOOLS</div><p>${esc(p.tools || '')}</p></div>` +
    `<div><div class="eyebrow">EXPERIENCE</div><p>${esc(p.experience || '')}</p><div class="intro-links"><a href="#cv">CV ↗</a>${data.linkedin ? `<a href="${esc(data.linkedin)}" target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a>` : `<span>LINKEDIN · ADD LINK</span>`}<a href="#library">PORTFOLIO ↓</a></div><div class="intro-links intro-links-email"><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></div></div>` +
    `</div></div>` +
    `<div class="intro-portrait">${data.portrait ? `<img src="${esc(sanitizeSrc(data.portrait))}" alt="Portrait of Yeseul Han">` : `<div class="portrait-placeholder"><span>PORTRAIT / 01</span><strong>Your portrait<br>goes here.</strong><small>ADD PHOTO IN CONTENT.JS</small></div>`}</div>` +
    `</section>`;
}

function carouselSection() {
  return `<section id="library" class="library-section section-anchor">` +
    `<div class="hero-header"><div class="eyebrow">02 / SELECTED WORK · PORTFOLIO 2026</div><h2>A collection of <em>creative worlds.</em></h2><p class="sub">${esc(data.intro)}</p></div>` +
    `<div class="carousel-area" aria-label="Rotating book portfolio"><div class="carousel-scene" id="carousel"><div class="carousel-floor"></div>${data.projects.map(cover).join('')}</div><div class="carousel-controls"><button class="round" id="prev" aria-label="Previous book">←</button><div class="selected-info" aria-live="polite"><strong id="selected-title"></strong><span id="selected-category"></span></div><button class="round" id="next" aria-label="Next book">→</button></div><button class="open-btn" id="openBook">OPEN SELECTED BOOK ↗</button></div>` +
    `<div class="home-bottom"><span>DRAG TO ROTATE · CLICK TO OPEN</span><span>DESIGNED IN AUCKLAND, NEW ZEALAND</span></div></section>`;
}

function caseSection() {
  const p = data.projects[0];
  const preview = `<img class="feature-preview" src="media/case-study-cover.png" alt="The Red Thread — Cheonyeo Gwishin character design case study cover">`;
  return `<section id="case-study" class="feature-section section-anchor"><div><div class="eyebrow">03 / FEATURED CASE STUDY · DESIGN 221</div><h2>${esc(p.title)},<br><em>${esc(p.subtitle)}.</em></h2><p>${esc(p.description)}</p><a class="feature-link" href="#project/practice">EXPLORE THE FULL CASE STUDY ↗</a></div><div class="feature-art-holder">${preview}</div></section>`;
}

function aboutSection() {
  const p = data.profile || {};
  return `<section id="about" class="overview-section section-anchor"><div><div class="eyebrow">04 / ABOUT ME</div><h2>Design with <em>range.</em></h2></div><div class="overview-copy"><h3>What I Do</h3><p>${esc(p.whatIDo || '')}</p><h3>My Design Approach</h3><p>${esc(p.approach || '')}</p><h3>Experience</h3><p>${esc(p.experience || '')}</p></div></section>`;
}

function cvSection() {
  return `<section id="cv" class="utility-section section-anchor"><div><div class="eyebrow">05 / CURRICULUM VITAE</div><h2>My <em>experience.</em></h2><p>Selected design, illustration, and professional experience. You can add a downloadable PDF later.</p></div>${data.cv ? `<a class="utility-action" href="${esc(sanitizeSrc(data.cv))}" download>DOWNLOAD CV ↗</a>` : `<div class="utility-action inactive">CV PDF COMING SOON <small>Add a PDF path in content.js</small></div>`}</section>`;
}

function contactSection() {
  return `<section id="contact" class="contact-section section-anchor"><div class="eyebrow">06 / CONTACT</div><h2>Let's make <em>something.</em></h2><a class="contact-email" href="mailto:${esc(data.email)}">${esc(data.email)} ↗</a><div class="contact-links">${data.linkedin ? `<a target="_blank" rel="noopener noreferrer" href="${esc(data.linkedin)}">LINKEDIN ↗</a>` : '<span>LINKEDIN · ADD LINK</span>'}<a href="#home">BACK TO TOP ↑</a></div></section>`;
}

function home() {
  app.innerHTML = `<div class="home page-transition">${profileSection()}${carouselSection()}${caseSection()}${aboutSection()}${cvSection()}${contactSection()}</div>`;
  const scene = document.getElementById('carousel');
  paintCarousel();
  document.getElementById('prev').onclick = () => spin(-1);
  document.getElementById('next').onclick = () => spin(1);
  document.getElementById('openBook').onclick = openSelected;

  scene.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    dragging = true;
    moved = false;
    mouseStart = e.clientX;
    startX = e.clientX;
    scene.classList.add('dragging');
    scene.setPointerCapture(e.pointerId);
  });

  scene.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(e.clientX - mouseStart) > 8) moved = true;
    if (Math.abs(dx) > 58) {
      spin(dx > 0 ? -1 : 1);
      startX = e.clientX;
    }
  });

  scene.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;
    scene.classList.remove('dragging');
    if (!moved) {
      const btn = e.target.closest('.book');
      if (btn) {
        const i = Number(btn.dataset.i);
        if (i === active) openSelected();
        else {
          active = i;
          paintCarousel();
        }
      }
    }
  });

  scene.addEventListener('pointercancel', () => {
    dragging = false;
    scene.classList.remove('dragging');
  });

  scene.addEventListener('wheel', e => {
    e.preventDefault();
    spin(e.deltaY > 0 || e.deltaX > 0 ? 1 : -1);
  }, { passive: false });
}

function project(id) {
  const p = data.projects.find(x => x.id === id);
  if (!p) {
    home();
    return;
  }
  const nxt = data.projects[(data.projects.indexOf(p) + 1) % data.projects.length];
  app.innerHTML = `<article class="page page-transition project-${esc(p.id)}"><a href="#home" class="back-link">← BACK TO LIBRARY</a><header class="project-head"><div><div class="eyebrow">VOL. ${esc(p.volume)} / ${esc(p.category)}</div><h1>${esc(p.title)}<br><i>${esc(p.subtitle)}</i></h1></div><div><p class="description">${esc(p.description)}</p><div class="details"><div><span>YEAR</span>${esc(p.year)}</div><div><span>DISCIPLINE</span>${esc(p.category)}</div></div></div></header>${p.sections.map(s => `<section class="project-section"><div class="eyebrow">${esc(s.eyebrow)}</div><div class="section-copy"><h2>${esc(s.heading)}</h2>${s.quote ? `<blockquote>${esc(s.quote)}</blockquote>` : ''}${renderText(s.text)}${s.link ? `<p class="project-external-link"><a href="${esc(s.link)}" target="_blank" rel="noopener noreferrer">${esc(s.linkLabel || 'VIEW MORE ↗')}</a></p>` : ''}${renderMedia(s.media, s.heading)}</div></section>`).join('')}<div class="next"><div><div class="eyebrow">NEXT COLLECTION</div><h3>${esc(nxt.title)}</h3></div><a class="text-link" href="#project/${encodeURIComponent(nxt.id)}">EXPLORE NEXT →</a></div></article>`;
}

function route() {
  const path = decodeURIComponent(location.hash.slice(1) || 'home');
  if (path.startsWith('project/')) {
    project(path.substring(8));
    window.scrollTo(0, 0);
    return;
  }
  if (!document.getElementById('home')) home();
  requestAnimationFrame(() => {
    const el = document.getElementById(path);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (path === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

window.addEventListener('hashchange', route);
window.addEventListener('keydown', e => {
  if (!document.getElementById('carousel')) return;
  if (e.key === 'ArrowRight') spin(1);
  else if (e.key === 'ArrowLeft') spin(-1);
});
window.addEventListener('resize', () => {
  if (document.getElementById('carousel')) paintCarousel();
});
document.getElementById('backTop').onclick = () => { location.hash = 'home'; };
route();

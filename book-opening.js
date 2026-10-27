/* Book-opening transition for YESEUL HAN portfolio.
   Loaded AFTER script.js. Keeps the existing rotating carousel untouched. */
(() => {
  let busy = false;
  let pointerStart = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function openBookWithMotion(index) {
    if (busy || !window.PORTFOLIO?.projects?.[index]) return;
    const book = document.querySelector(`.carousel-scene .book[data-i="${index}"]`);
    if (!book) return;
    const project = window.PORTFOLIO.projects[index];
    if (reduceMotion.matches) {
      location.hash = 'project/' + project.id;
      return;
    }
    busy = true;
    const rect = book.getBoundingClientRect();
    const scene = document.createElement('div');
    scene.className = 'bo-overlay';
    scene.setAttribute('aria-hidden', 'true');
    const shell = document.createElement('div');
    shell.className = 'bo-shell';
    shell.style.left = rect.left + 'px';
    shell.style.top = rect.top + 'px';
    shell.style.width = rect.width + 'px';
    shell.style.height = rect.height + 'px';
    shell.style.setProperty('--bo-x', (window.innerWidth / 2 - (rect.left + rect.width / 2)) + 'px');
    shell.style.setProperty('--bo-y', (window.innerHeight / 2 - (rect.top + rect.height / 2)) + 'px');
    // Make the OPEN book spread large: each page can occupy up to 36vw x 76vh.
    const scale = Math.min(
      (window.innerWidth * 0.36) / Math.max(rect.width, 1),
      (window.innerHeight * 0.76) / Math.max(rect.height, 1),
      2.85
    );
    shell.style.setProperty('--bo-scale', String(Math.max(1, scale)));
    // When the cover opens leftwards, shift the book half a page to the right.
    shell.style.setProperty('--bo-spread-offset', (rect.width * scale * 0.50) + 'px');
    shell.style.setProperty('--bo-color', project.cover || '#785a61');
    shell.style.setProperty('--bo-ink', project.ink || '#fff');
    const pages = document.createElement('div');
    pages.className = 'bo-pages';
    // Intentionally blank pages: immediately transition to project content.
    pages.innerHTML = '';
    const front = document.createElement('div');
    front.className = 'bo-front';
    const copied = book.querySelector('.book-cover');
    if (copied) {
      front.appendChild(copied.cloneNode(true));
    } else {
      front.textContent = project.title;
    }
    const spine = document.createElement('div');
    spine.className = 'bo-spine';
    shell.append(pages, front, spine);
    scene.appendChild(shell);
    document.body.appendChild(scene);
    document.documentElement.classList.add('bo-in-progress');
    requestAnimationFrame(() => requestAnimationFrame(() => scene.classList.add('bo-playing')));
    window.setTimeout(() => {
      location.hash = 'project/' + project.id;
      scene.classList.add('bo-finishing');
      window.setTimeout(() => {
        scene.remove();
        document.documentElement.classList.remove('bo-in-progress');
        busy = false;
      }, 260);
    }, 1140);
  }

  // Capture before the original carousel pointerup listener, only for a tap
  // on the CENTER book. Side-book clicks still rotate exactly as before.
  document.addEventListener('pointerdown', e => {
    if (!e.target.closest?.('.carousel-scene .book')) { pointerStart = null; return; }
    pointerStart = { x: e.clientX, y: e.clientY };
  }, true);

  document.addEventListener('pointerup', e => {
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const book = hit?.closest?.('.carousel-scene .book') || e.target.closest?.('.carousel-scene .book');
    if (!book || !pointerStart || busy) return;
    const displacement = Math.hypot(e.clientX - pointerStart.x, e.clientY - pointerStart.y);
    pointerStart = null;
    if (displacement > 8) return;
    const idx = Number(book.dataset.i);
    const center = document.querySelector('.carousel-scene .book[aria-pressed="true"]');
    if (center !== book) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // Original carousel listener won't see this pointerup; release capture
    // and reset dragging class, so the carousel remains usable if needed.
    const carousel = document.querySelector('.carousel-scene');
    carousel?.classList.remove('dragging');
    try { carousel?.releasePointerCapture(e.pointerId); } catch (_) {}
    openBookWithMotion(idx);
  }, true);

  // Intercept the existing "OPEN SELECTED BOOK" button.
  document.addEventListener('click', e => {
    const button = e.target.closest?.('#openBook');
    if (button) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const book = document.querySelector('.carousel-scene .book[aria-pressed="true"]');
      if (book) openBookWithMotion(Number(book.dataset.i));
      return;
    }
    // Keyboard activation on a selected book button.
    const book = e.target.closest?.('.carousel-scene .book');
    if (book && e.detail === 0 && book.getAttribute('aria-pressed') === 'true') {
      e.preventDefault();
      e.stopImmediatePropagation();
      openBookWithMotion(Number(book.dataset.i));
    }
  }, true);
})();
